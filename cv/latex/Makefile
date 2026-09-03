SHELL := /bin/sh

ROOT := ../..
BUILD_DIR := build
SOURCE := pavel_vasilyev_cv.tex
PROVENANCE := provenance.json
META := build-meta.tex
OUTPUT_DIR := $(ROOT)/output/pdf
OUTPUT_PDF := $(OUTPUT_DIR)/Pavel_Vasilyev_Fractional_AI_Systems_CV.pdf
NIX ?= nix
# `#` starts a Make comment, so retain it with an escaped hash for the Nix flake reference.
TECTONIC := $(NIX) run nixpkgs\#tectonic --

.DEFAULT_GOAL := all
.PHONY: all provenance check clean

all: $(OUTPUT_PDF)

# Kept separate so the document can also be built with a locally installed
# `tectonic` by setting TECTONIC='tectonic'.
provenance: $(PROVENANCE) $(META)

$(PROVENANCE) $(META): generate-provenance.mjs ../../cv/knowledge-base.json
	node generate-provenance.mjs

$(OUTPUT_DIR):
	mkdir -p $(OUTPUT_DIR)

$(OUTPUT_PDF): provenance $(SOURCE) | $(OUTPUT_DIR)
	mkdir -p $(BUILD_DIR)
	$(TECTONIC) -X compile --outdir $(BUILD_DIR) --keep-logs --keep-intermediates $(SOURCE)
	cp $(BUILD_DIR)/$(SOURCE:.tex=.pdf) $(OUTPUT_PDF)

check: $(OUTPUT_PDF)
	pdftotext $(OUTPUT_PDF) - | rg -q "Pavel Vasilyev"
	pdftotext $(OUTPUT_PDF) - | rg -q "Selected systems"
	pdfinfo $(OUTPUT_PDF) | rg -q "Title:.*Pavel Vasilyev"

clean:
	rm -rf $(BUILD_DIR)
