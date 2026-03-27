#!/bin/bash

# Generate .env file from environment variables
cat > .env << EOF
PUBLIC_HA_URL=${PUBLIC_HA_URL:-http://localhost:8123}
PUBLIC_HA_TOKEN=${PUBLIC_HA_TOKEN:-}
EOF

echo "Generated .env file with:"
echo "PUBLIC_HA_URL=${PUBLIC_HA_URL:-http://localhost:8123}"

# Start the application
exec "$@"
