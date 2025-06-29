#!/bin/bash

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "Pandoc is required but not installed. Installing..."
    brew install pandoc
fi

# Check if pdflatex is installed
if ! command -v pdflatex &> /dev/null; then
    echo "PDFLaTeX is required but not installed. Installing BasicTeX..."
    brew install basictex
    eval "$(/usr/libexec/path_helper)"
    sudo tlmgr update --self
    sudo tlmgr install collection-fontsrecommended
fi

# Convert markdown to PDF
pandoc RASPBERRY_PI_SETUP.md \
    -f markdown \
    -t pdf \
    -o Greenhouse_Raspberry_Pi_Setup_Guide.pdf \
    --toc \
    --highlight-style=tango \
    --variable geometry:margin=1in \
    --variable fontsize=11pt \
    --variable mainfont="DejaVu Sans" \
    --variable monofont="DejaVu Sans Mono" \
    --pdf-engine=pdflatex

echo "PDF has been generated as Greenhouse_Raspberry_Pi_Setup_Guide.pdf" 