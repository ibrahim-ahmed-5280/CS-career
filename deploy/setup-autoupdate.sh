#!/usr/bin/env bash
# One-time setup: server pulls from GitHub every 30s. Run from the project root:
#   bash deploy/setup-autoupdate.sh
set -euo pipefail
HOST=root@104.237.2.66
cd "$(dirname "$0")/.."
scp deploy/cscareer-update deploy/nginx-cscareer.conf "$HOST":/tmp/

ssh "$HOST" 'bash -s' <<'REMOTE'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
command -v git >/dev/null || { apt-get update -y && apt-get install -y git; }

sed -i 's/\r$//' /tmp/cscareer-update
install -m 755 /tmp/cscareer-update /usr/local/bin/cscareer-update
cp /tmp/nginx-cscareer.conf /etc/nginx/sites-available/cscareer
nginx -t && systemctl reload nginx

cat > /etc/systemd/system/cscareer-update.service <<'UNIT'
[Unit]
Description=Pull CS Career from GitHub and publish
[Service]
Type=oneshot
ExecStart=/usr/local/bin/cscareer-update
UNIT
cat > /etc/systemd/system/cscareer-update.timer <<'UNIT'
[Unit]
Description=Check GitHub for CS Career updates every 30s
[Timer]
OnBootSec=30s
OnUnitActiveSec=30s
AccuracySec=1s
[Install]
WantedBy=timers.target
UNIT
systemctl daemon-reload
systemctl enable --now cscareer-update.timer
systemctl start cscareer-update.service
rm -f /tmp/cscareer-update /tmp/nginx-cscareer.conf
tail -2 /var/log/cscareer-deploy.log
systemctl is-active cscareer-update.timer
REMOTE
curl -sI https://cscareer.onepercenttech.com | grep -i -E "HTTP|cache-control"
