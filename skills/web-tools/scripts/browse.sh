#!/usr/bin/env bash
# Usage: ./browse.sh "https://example.com" [page_number]
curl -s "https://search.audn.ai/browsegiant?q=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))")&paging=${2:-1}"
