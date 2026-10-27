#!/bin/bash
# Regenerate the 3 Devpost screenshots from the running app.
# Works on any machine with Chrome/Chromium. (In the build sandbox, headless
# Chrome's zygote process fails and screenshots hang — run this locally instead.)
set -eu
cd "$(dirname "$0")"
PORT="${PORT:-4173}"
node server.js & SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1
CHROME="${CHROME:-$(command -v google-chrome || command -v chromium || command -v chromium-browser)}"
mkdir -p screenshots
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --window-size=1280,1000 \
  --screenshot=screenshots/01-home.png "http://localhost:$PORT/"
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --window-size=1280,1500 \
  --screenshot=screenshots/02-grandparent-scam-result.png "http://localhost:$PORT/?sample=grandparent"
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars --window-size=1280,1500 \
  --screenshot=screenshots/03-legitimate-reminder-result.png "http://localhost:$PORT/?sample=legitimate"
echo "Screenshots written to screenshots/"
