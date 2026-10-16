#!/usr/bin/env bash
# Builds the site under the review link and uploads it to the VPS: https://api.billthedevstudio.com/preview/<token>/site/
# Usage: PREVIEW_HOST=user@host scripts/deploy-preview.sh <token>
set -euo pipefail
TOK="${1:?review token}"
HOST="${PREVIEW_HOST:?set PREVIEW_HOST=user@host (the VPS that serves /preview/)}"
cd "$(dirname "$0")/.."
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_SHOW_DRAFTS=1 NEXT_PUBLIC_BASE_PATH="/preview/$TOK/site" npx next build
tar czf /tmp/site.tgz -C out .
scp -q /tmp/site.tgz "$HOST:/tmp/site.tgz"
ssh "$HOST" "set -e; D=/var/www/studio-preview/$TOK/site; rm -rf \$D.new; mkdir -p \$D.new; tar xzf /tmp/site.tgz -C \$D.new; rm /tmp/site.tgz; rm -rf \$D; mv \$D.new \$D; find \$D -type d -exec chmod 755 {} +; find \$D -type f -exec chmod 644 {} +"
rm -f /tmp/site.tgz
echo "https://api.billthedevstudio.com/preview/$TOK/site/"
