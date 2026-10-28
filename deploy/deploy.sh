#!/usr/bin/env bash
# Set up the server and put the current master live. Run from the project root:
#   bash deploy/deploy.sh
# You are asked for the root password twice: once to copy the files, once to run the setup.
# The setup (deploy/server-setup.sh) installs Node.js, MongoDB (unless /etc/cscareer.env points to
# another database), the app service and the 30-second auto-update from GitHub. Safe to run again.
set -euo pipefail
HOST=root@104.237.2.66
DOMAIN=cscareer.onepercenttech.com
cd "$(dirname "$0")/.."

scp deploy/server-setup.sh deploy/cscareer-update deploy/nginx-cscareer.conf deploy/nginx-cscareer-http.conf server/.env.example "$HOST":/tmp/
ssh -t "$HOST" "sed -i 's/\r\$//' /tmp/server-setup.sh && bash /tmp/server-setup.sh"

echo
curl -s -o /dev/null -w "https://$DOMAIN answered %{http_code}\n" "https://$DOMAIN/api/departments"
