// Free-slot endpoint for the landing page's booking widget.
// Reads a private/free-busy iCal feed (secret ICS_URL), returns free slots
// inside working hours (Asia/Jerusalem) between today+2 and today+14 days.
// Only start/end times are returned; no event details leave the Worker.

const TZ = "Asia/Jerusalem";

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "*").split(",").map(s => s.trim());
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes("*") ? "*" : (allowed.includes(origin) ? origin : allowed[0]),
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Vary": "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: cors });

    const cache = caches.default;
    const cacheKey = new Request(new URL("/slots-cache", request.url).toString());
    let res = await cache.match(cacheKey);
    if (!res) {
      try {
        if (!env.ICS_URL) throw new Error("ICS_URL not set");
        const r = await fetch(env.ICS_URL, { cf: { cacheTtl: 300 } });
        if (!r.ok) throw new Error("calendar fetch " + r.status);
        const busy = parseBusy(await r.text());
        const slots = freeSlots(busy, env);
        res = new Response(JSON.stringify({ tz: TZ, generated: new Date().toISOString(), slots }), {
          headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
        });
        ctx.waitUntil(cache.put(cacheKey, res.clone()));
      } catch (e) {
        return new Response(JSON.stringify({ error: "unavailable" }), {
          status: 503, headers: { ...cors, "Content-Type": "application/json" },
        });
      }
    }
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
    return out;
  },
};

// ---------- configuration (wrangler.toml [vars]) ----------
function cfg(env) {
  return {
    days: (env.WORK_DAYS || "0,1,2,3,4").split(",").map(Number),   // 0=Sun ... 6=Sat
    start: hm(env.WORK_START || "10:00"),
    end: hm(env.WORK_END || "18:00"),
    slot: Number(env.SLOT_MINUTES || 45),
    step: Number(env.STEP_MINUTES || 60),
    buffer: Number(env.BUFFER_MINUTES || 15),
    minDays: Number(env.MIN_DAYS_AHEAD || 2),
    maxDays: Number(env.MAX_DAYS_AHEAD || 14),
    perDay: Number(env.MAX_SLOTS_PER_DAY || 4),
  };
}
const hm = s => { const [h, m] = s.split(":").map(Number); return h * 60 + (m || 0); };

// ---------- time zone helpers (no libraries) ----------
function tzParts(date, tz = TZ) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short",
  }).formatToParts(date).map(x => [x.type, x.value]));
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour, mi: +p.minute, s: +p.second,
           wd: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(p.weekday) };
}
// Convert a wall-clock time in tz to a UTC Date.
function zoned(y, mo, d, h, mi, tz = TZ) {
  let guess = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 2; i++) {
    const p = tzParts(new Date(guess), tz);
    const asUtc = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s);
    guess += Date.UTC(y, mo - 1, d, h, mi) - asUtc;
  }
  return new Date(guess);
}

// ---------- iCal parsing: VEVENT and VFREEBUSY ----------
function unfold(text) { return text.replace(/\r?\n[ \t]/g, ""); }
function parseDate(value, params) {
  const tzid = (params.match(/TZID=([^;:]+)/) || [])[1];
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  if (h === undefined) return { date: zoned(+y, +mo, +d, 0, 0, TZ), allDay: true };
  if (z) return { date: new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)) };
  let tz = tzid || TZ;
  try { new Intl.DateTimeFormat("en-US", { timeZone: tz }); } catch { tz = TZ; }
  return { date: zoned(+y, +mo, +d, +h, +mi, tz) };
}
function parseDuration(s) {
  const m = s.match(/^([+-])?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!m) return 0;
  return (((+m[2] || 0) * 7 + (+m[3] || 0)) * 86400 + (+m[4] || 0) * 3600 + (+m[5] || 0) * 60 + (+m[6] || 0)) * 1000;
}
function parseBusy(ics) {
  const lines = unfold(ics).split(/\r?\n/);
  const busy = [];
  let ev = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { ev = {}; continue; }
    if (line === "END:VEVENT") {
      if (ev && ev.start && ev.transp !== "TRANSPARENT" && ev.status !== "CANCELLED") {
        const end = ev.end || (ev.dur ? new Date(ev.start.getTime() + ev.dur)
                    : new Date(ev.start.getTime() + (ev.allDay ? 864e5 : 0)));
        if (ev.rrule) expandWeekly(ev, end, busy); else busy.push([ev.start.getTime(), end.getTime()]);
      }
      ev = null; continue;
    }
    const i = line.indexOf(":"); if (i < 0) continue;
    const head = line.slice(0, i), value = line.slice(i + 1);
    const [name, ...rest] = head.split(";"); const params = rest.join(";");
    if (name === "FREEBUSY" && !/FBTYPE=FREE(;|$)/.test(params)) {
      for (const period of value.split(",")) {
        const [a, b] = period.split("/");
        const s = parseDate(a, ""); if (!s) continue;
        const e = b.startsWith("P") || b.startsWith("+P") ? new Date(s.date.getTime() + parseDuration(b)) : parseDate(b, "")?.date;
        if (e) busy.push([s.date.getTime(), e.getTime()]);
      }
      continue;
    }
    if (!ev) continue;
    if (name === "DTSTART") { const r = parseDate(value, params); if (r) { ev.start = r.date; ev.allDay = r.allDay; } }
    else if (name === "DTEND") { const r = parseDate(value, params); if (r) ev.end = r.date; }
    else if (name === "DURATION") ev.dur = parseDuration(value);
    else if (name === "TRANSP") ev.transp = value;
    else if (name === "STATUS") ev.status = value;
    else if (name === "RRULE") ev.rrule = value;
  }
  return busy;
}
// Minimal recurrence support: DAILY and WEEKLY (with INTERVAL, COUNT, UNTIL, BYDAY).
// Calendars that export "free/busy" feeds (Google, Fastmail, iCloud) usually expand
// recurrences already; this covers the rest well enough for a two-week window.
function expandWeekly(ev, end, busy) {
  const r = Object.fromEntries(ev.rrule.split(";").map(kv => kv.split("=")));
  if (!["DAILY", "WEEKLY"].includes(r.FREQ)) { busy.push([ev.start.getTime(), end.getTime()]); return; }
  const len = end - ev.start, interval = +(r.INTERVAL || 1);
  const until = r.UNTIL ? parseDate(r.UNTIL, "")?.date.getTime() : Infinity;
  const horizon = Date.now() + 16 * 864e5;
  const days = r.BYDAY ? r.BYDAY.split(",").map(x => ["SU","MO","TU","WE","TH","FR","SA"].indexOf(x.slice(-2))) : null;
  const sp = tzParts(ev.start);
  let count = 0;
  for (let k = 0; k < 2000; k++) {
    const day = new Date(Date.UTC(sp.y, sp.mo - 1, sp.d + k));
    const s = zoned(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), sp.h, sp.mi);
    if (s.getTime() > Math.min(until, horizon)) break;
    const weekIdx = Math.floor(k / 7);
    const ok = r.FREQ === "DAILY" ? k % interval === 0
      : weekIdx % interval === 0 && (days ? days.includes(day.getUTCDay()) : k % 7 === 0);
    if (!ok) continue;
    count++; if (r.COUNT && count > +r.COUNT) break;
    busy.push([s.getTime(), s.getTime() + len]);
  }
}

// ---------- slot computation ----------
function freeSlots(busy, env) {
  const c = cfg(env);
  const now = new Date(), t = tzParts(now);
  const slots = [];
  for (let d = c.minDays; d <= c.maxDays; d++) {
    const day = new Date(Date.UTC(t.y, t.mo - 1, t.d + d));
    const y = day.getUTCFullYear(), mo = day.getUTCMonth() + 1, dd = day.getUTCDate();
    if (!c.days.includes(day.getUTCDay())) continue;
    let n = 0;
    for (let m = c.start; m + c.slot <= c.end && n < c.perDay; m += c.step) {
      const s = zoned(y, mo, dd, Math.floor(m / 60), m % 60);
      const e = new Date(s.getTime() + c.slot * 60000);
      const bs = s.getTime() - c.buffer * 60000, be = e.getTime() + c.buffer * 60000;
      if (busy.some(([a, b]) => a < be && b > bs)) continue;
      slots.push({ start: s.toISOString(), end: e.toISOString() }); n++;
    }
  }
  return slots;
}
