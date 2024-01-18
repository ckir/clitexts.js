#!/bin/bash
clear
SCRIPT_DIR="$(dirname "$(realpath -P "$0")")"
cd $SCRIPT_DIR
for fontfile in ./figlet/*.flf; do echo $fontfile; figlet -f "$fontfile" "Sample Text"; done