#!/bin/bash

# Script untuk monitoring error 404 dan 401 dengan beep alert
# Script ini otomatis navigate ke folder my-frontend

# Path ke folder project
PROJECT_DIR="/home/syahril/Desktop/dev/wancash_staking/my-frontend"

echo "🔍 Starting error monitor for 404 Not Found and 401 Unauthorized..."
echo "📁 Navigating to: $PROJECT_DIR"

# Check apakah folder exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Error: Folder $PROJECT_DIR tidak ditemukan!"
    exit 1
fi

# Navigate ke folder project
cd "$PROJECT_DIR" || exit 1

echo "✅ Current directory: $(pwd)"
echo "🚀 Starting both servers: bun c:dev + bun dev"
echo "----------------------------------------"

# Jalankan kedua perintah secara paralel dan gabungkan outputnya
(bun c:dev 2>&1 | sed 's/^/[CLOUDFLARE] /' & bun dev 2>&1 | sed 's/^/[VITE] /') | while IFS= read -r line; do
    echo "$line"
    
    # Check untuk 404 Not Found
    if echo "$line" | grep -q "404 Not Found"; then
        printf '\a'  # Beep
        echo "🚨 [ALERT] 404 Not Found detected!"
        # Notifikasi desktop (jika ada notify-send)
        which notify-send &>/dev/null && notify-send "❌ 404 Detected" "404 Not Found detected in console" -u critical
    fi
    
    # Check untuk 401 Unauthorized
    if echo "$line" | grep -q "401 Unauthorized"; then
        printf '\a'  # Beep
        echo "🚨 [ALERT] 401 Unauthorized detected!"
        # Notifikasi desktop (jika ada notify-send)
        which notify-send &>/dev/null && notify-send "🔒 401 Detected" "401 Unauthorized detected in console" -u critical
    fi
done
