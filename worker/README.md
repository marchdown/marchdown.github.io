# Free-slot Worker

Returns `{"tz","generated","slots":[{"start","end"}]}` with CORS. Reads your calendar's secret iCal address (Google Calendar: Settings → your calendar → "Secret address in iCal format"; any free/busy ICS works). Only start and end times leave the Worker; titles and attendees are never returned. Responses are cached for 5 minutes.

Deploy:

1. `cd worker && npm i -D wrangler && npx wrangler login`
2. Edit `ALLOWED_ORIGINS` and working hours in `wrangler.toml`.
3. `npx wrangler secret put ICS_URL` and paste the secret iCal URL.
4. `npx wrangler deploy` and note the URL it prints (add `/slots` or any path).
5. Put that URL into `CONFIG.endpoint` in `index.html` and redeploy the page.

Check: `curl https://<worker>.workers.dev/slots`. If `ICS_URL` is missing or the feed fails, the Worker returns 503 and the page falls back to "write to me".

Limits: recurring events are expanded for DAILY/WEEKLY rules only (EXDATE is ignored, so an occasional cancelled instance still shows as busy, which errs on the safe side). Google's secret feed is fully adequate for a two-week window.
