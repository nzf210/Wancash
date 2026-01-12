#!/bin/bash

# Script to check and set admin role for first user

echo "🔍 Checking users in database..."

# Check current users
psql $NEON_DATABASE -c "SELECT id, wallet_address, role FROM users ORDER BY created_at LIMIT 5;"

echo ""
echo "📝 To set first user as admin, run:"
echo "psql \$NEON_DATABASE -c \"UPDATE users SET role = 'admin' WHERE id = (SELECT id FROM users ORDER BY created_at LIMIT 1);\""

echo ""
echo "Or set specific wallet as admin:"
echo "psql \$NEON_DATABASE -c \"UPDATE users SET role = 'admin' WHERE wallet_address = '0xYourWalletAddress';\""
