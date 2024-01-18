#!/bin/bash
clear
SCRIPT_DIR="$(dirname "$(realpath -P "$0")")"
cd $SCRIPT_DIR
fonts=(console block simpleBlock simple 3d simple3d chrome huge shade slick grid pallet tiny)
for font in "${fonts[@]}"; do echo $font; cfonts "Sample Text" -f "$font"; done