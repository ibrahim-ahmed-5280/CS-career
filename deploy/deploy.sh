#!/usr/bin/env bash
# Deploy CS Career to cscareer.onepercenttech.com. Run from the project root:
#   bash deploy/deploy.sh
# You will be asked for the root password (once per ssh/scp call).
set -euo pipefail
HOST=root@104.237.2.66
DOMAIN=cscareer.onepercenttech.com
cd "$(dirname "$0")/.."

tar czf /tmp/cscareer.tgz --exclude=assets/logo-options --exclude=assets/hero-bg.svg index.html department.html quiz.html contact.html assets css js
scp /tmp/cscareer.tgz deploy/nginx-cscareer.conf deploy/nginx-cscareer-http.conf "$HOST":/tmp/

ssh "$HOST" 'bash -s' <<REMOTE
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
command -v nginx >/dev/null || { apt-get update -y && apt-get install -y nginx; }
command -v certbot >/dev/null || apt-get install -y certbot python3-certbot-nginx

mkdir -p /var/www/cscareer
rm -rf /var/www/cscareer/*
tar xzf /tmp/cscareer.tgz --no-same-owner -C /var/www/cscareer
chown -R www-data:www-data /var/www/cscareer

if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  cp /tmp/nginx-cscareer-http.conf /etc/nginx/sites-available/cscareer
  ln -sf /etc/nginx/sites-available/cscareer /etc/nginx/sites-enabled/cscareer
  nginx -t && systemctl reload nginx
  certbot certonly --webroot -w /var/www/cscareer -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email
fi

cp /tmp/nginx-cscareer.conf /etc/nginx/sites-available/cscareer
ln -sf /etc/nginx/sites-available/cscareer /etc/nginx/sites-enabled/cscareer
nginx -t
systemctl enable --now nginx
systemctl reload nginx
if command -v ufw >/dev/null && ufw status | grep -q active; then ufw allow 'Nginx Full' || true; fi
rm -f /tmp/cscareer.tgz /tmp/nginx-cscareer*.conf
REMOTE

curl -s https://$DOMAIN | grep -o '<title>[^<]*'
