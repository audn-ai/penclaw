#!/usr/bin/env bash
# Usage: ./search.sh "query string"
curl -s "https://search.audn.ai/gptssearch?q=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))")&percentile=1&numofpages=1&inputwindowwords=100000"
