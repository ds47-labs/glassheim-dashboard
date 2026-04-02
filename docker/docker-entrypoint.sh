#!/bin/sh
set -e

cat > /app/build/client/config.js <<EOF
window.__config__ = {
  PUBLIC_HA_URL: "${PUBLIC_HA_URL:-}",
  PUBLIC_HA_TOKEN: "${PUBLIC_HA_TOKEN:-}"
};
EOF

exec node build
