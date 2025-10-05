#!/bin/bash
set -e

sudo docker compose down -v

echo "🔁 Pulling latest code..."
git pull origin main || true

echo "📦 Building Docker containers..."
sudo docker compose build --no-cache

echo "🚀 Starting containers..."
sudo docker compose up -d

# Cấu hình Nginx nếu chưa có
if [ ! -f /etc/nginx/sites-available/storelab ]; then
  echo "🌐 Setting up Nginx..."
  sudo bash -c "cat <<'EOF' > /etc/nginx/sites-available/storelab
  server {
      listen 80;
      server_name vhu-storelab.io.vn www.vhu-storelab.io.vn;

      location / {
          proxy_pass http://127.0.0.1:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade \$http_upgrade;
          proxy_set_header Connection \"upgrade\";
          proxy_set_header Host \$host;
          proxy_cache_bypass \$http_upgrade;
          proxy_set_header X-Real-IP \$remote_addr;
          proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto \$scheme;
      }
  }

  server {
      listen 127.0.0.1:80;
      server_name 127.0.0.1 localhost;

      location / {
          proxy_pass http://127.0.0.1:3000;
          proxy_http_version 1.1;
          proxy_set_header Host \$host;
          proxy_set_header X-Real-IP \$remote_addr;
          proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
      }
  }
  EOF"

  sudo ln -s /etc/nginx/sites-available/storelab /etc/nginx/sites-enabled/
  sudo nginx -t && sudo systemctl restart nginx
fi

# Xin SSL nếu chưa có
if [ ! -d /etc/letsencrypt/live/vhu-storelab.io.vn ]; then
  echo "🔐 Getting SSL certificate..."
  sudo apt install -y certbot python3-certbot-nginx
  sudo certbot --nginx -d vhu-storelab.io.vn -d www.vhu-storelab.io.vn
fi

echo "✅ Deploy completed! Visit: https://vhu-storelab.io.vn"