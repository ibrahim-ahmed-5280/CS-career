#!/usr/bin/env bash
# Runs ON the server when its MongoDB asks for a login (it is shared with other apps).
# Creates a "cscareer" database user that can only use the cscareer database,
# saves it in /etc/cscareer.env and restarts the app. Needs your MongoDB admin login once.
# Run again any time to give the user a new password.
set -euo pipefail
SH=$(command -v mongosh || command -v mongo || true)
[ -n "$SH" ] || { echo ">>> mongosh is not installed: apt-get install -y mongodb-mongosh"; exit 1; }

echo "MongoDB on this server needs a login. Enter the MongoDB admin account your other apps use."
read -rp "MongoDB admin user name: " ADMIN
read -rp "Its authentication database [admin]: " AUTHDB
AUTHDB=${AUTHDB:-admin}
PW=$(openssl rand -hex 24)   # letters and digits only, safe inside the connection address

# -p without a value: the shell asks for the admin password without showing it
"$SH" --quiet -u "$ADMIN" -p --authenticationDatabase "$AUTHDB" --eval "
  const d = db.getSiblingDB('cscareer');
  if (d.getUser('cscareer')) d.changeUserPassword('cscareer', '$PW');
  else d.createUser({ user: 'cscareer', pwd: '$PW', roles: [{ role: 'readWrite', db: 'cscareer' }] });
  print('Database user cscareer is ready.');"

sed -i "s|^MONGODB_URI=.*|MONGODB_URI=mongodb://cscareer:$PW@127.0.0.1:27017/cscareer?authSource=cscareer|" /etc/cscareer.env
if systemctl cat cscareer-api >/dev/null 2>&1; then systemctl restart cscareer-api; fi
echo "Saved in /etc/cscareer.env."
