#!/bin/bash
# kills all processes on dev ports

# Astro dev server (port 4321)
lsof -ti:4321 | xargs kill -9 2>/dev/null && echo "Killed process on port 4321" || echo "Nothing running on port 4321"
