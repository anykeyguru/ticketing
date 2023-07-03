#!/usr/bin/env bash

find . -not -path "*/node_modules/*" -type f -print0 | xargs -0 dos2unix