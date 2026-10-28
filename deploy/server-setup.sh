#!/usr/bin/env bash
# Runs ON the server (copied to /tmp and started by deploy/deploy.sh).
# Installs Node.js, MongoDB, the app service and the auto-update, then switches nginx to the app.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
DOMAIN=cscareer.onepercenttech.com
step() { echo; echo "==> $*"; }

step "Installing system packages (git, nginx, certbot, Node.js)"
systemctl stop cscareer-update.timer 2>/dev/null || true   # no auto-update while we set up
command -v git >/dev/null || { apt-get update -y && apt-get install -y git; }
command -v nginx >/dev/null || { apt-get update -y && apt-get install -y nginx; }
command -v certbot >/dev/null || apt-get install -y certbot python3-certbot-nginx
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

step "Writing settings"
# Settings: database address and login secret. Never stored in git.
if [ ! -f /etc/cscareer.env ]; then
  sed "s|^JWT_SECRET=.*|JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")|" /tmp/.env.example > /etc/cscareer.env
  chmod 600 /etc/cscareer.env
fi

step "Database"
# No external database given (for example MongoDB Atlas): run MongoDB on this server, reachable only locally
if grep -q "cluster.example" /etc/cscareer.env; then
  if ! grep -qw avx /proc/cpuinfo; then
    echo ">>> This server's CPU cannot run MongoDB 8. Put a MongoDB Atlas address in /etc/cscareer.env (MONGODB_URI=...) and run this script again."
    exit 1
  fi
  if ! command -v mongod >/dev/null; then
    . /etc/os-release
    apt-get install -y gnupg curl
    curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | gpg --dearmor --yes -o /usr/share/keyrings/mongodb-server-8.0.gpg
    case "$ID" in
      ubuntu) echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu $VERSION_CODENAME/mongodb-org/8.0 multiverse" ;;
      debian) echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/debian $VERSION_CODENAME/mongodb-org/8.0 main" ;;
      *) echo ">>> Unknown system $ID: install MongoDB yourself or use MongoDB Atlas."; exit 1 ;;
    esac > /etc/apt/sources.list.d/mongodb-org-8.0.list
    apt-get update -y && apt-get install -y mongodb-org
  fi
  systemctl enable --now mongod
  sed -i 's|^MONGODB_URI=.*|MONGODB_URI=mongodb://127.0.0.1:27017/cscareer|' /etc/cscareer.env
fi

step "HTTPS certificate"
# HTTPS certificate (first time only). /var/www/cscareer is the folder certbot renewals already use.
mkdir -p /var/www/cscareer
if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
  cp /tmp/nginx-cscareer-http.conf /etc/nginx/sites-available/cscareer
  ln -sf /etc/nginx/sites-available/cscareer /etc/nginx/sites-enabled/cscareer
  nginx -t && systemctl reload nginx
  certbot certonly --webroot -w /var/www/cscareer -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email
fi

sed -i 's/\r$//' /tmp/cscareer-update
install -m 755 /tmp/cscareer-update /usr/local/bin/cscareer-update

cat > /etc/systemd/system/cscareer-api.service <<'UNIT'
[Unit]
Description=CS Career API and website
After=network-online.target mongod.service
[Service]
WorkingDirectory=/opt/cscareer/server
EnvironmentFile=/etc/cscareer.env
ExecStart=/usr/bin/node src/index.js
Restart=always
User=www-data
[Install]
WantedBy=multi-user.target
UNIT
cat > /etc/systemd/system/cscareer-update.service <<'UNIT'
[Unit]
Description=Pull CS Career from GitHub, build and restart
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

step "Downloading, building and starting the app (a few minutes)"
rm -f /var/lib/cscareer.rev          # force a fresh build of the new version
/usr/local/bin/cscareer-update
systemctl enable --now cscareer-api cscareer-update.timer

step "Switching nginx to the app"
cp /tmp/nginx-cscareer.conf /etc/nginx/sites-available/cscareer
ln -sf /etc/nginx/sites-available/cscareer /etc/nginx/sites-enabled/cscareer
nginx -t && systemctl reload nginx
if command -v ufw >/dev/null && ufw status | grep -q active; then ufw allow 'Nginx Full' || true; fi
rm -f /tmp/cscareer-update /tmp/nginx-cscareer*.conf /tmp/.env.example /tmp/server-setup.sh
tail -2 /var/log/cscareer-deploy.log
step "Done"
