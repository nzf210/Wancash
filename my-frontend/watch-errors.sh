#!/bin/bash

# Script untuk monitoring error 404 dan 401 dengan beep alert
# Jalankan script ini di folder my-frontend

echo "🔍 Starting error monitor for 404 Not Found and 401 Unauthorized..."
echo "📁 Running in: $(pwd)"
echo "----------------------------------------"

bun c:dev 2>&1 | while IFS= read -r line; do
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
