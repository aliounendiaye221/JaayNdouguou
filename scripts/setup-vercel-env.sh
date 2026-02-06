#!/bin/bash

# Vercel Environment Variables Setup Helper
# This script helps you set up environment variables in Vercel via CLI

set -e

echo "🚀 JaayNdougou - Vercel Environment Variables Setup"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "   Install with: npm i -g vercel"
    echo "   Then run this script again."
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check if .env.vercel.local exists
if [ ! -f ".env.vercel.local" ]; then
    echo "❌ .env.vercel.local not found!"
    echo "   Generate credentials first with:"
    echo "   node scripts/generate-credentials.js"
    exit 1
fi

echo "✅ .env.vercel.local found"
echo ""

# Ask for confirmation
echo "⚠️  IMPORTANT NOTES:"
echo "   1. Make sure you've rotated the Neon database password"
echo "   2. Make sure DATABASE_URL and DIRECT_URL in .env.vercel.local are updated"
echo "   3. You'll need to authenticate with Vercel"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Login to Vercel
echo ""
echo "📝 Step 1: Vercel Authentication"
echo "================================="
vercel login

echo ""
echo "📝 Step 2: Link to Project"
echo "=========================="
echo "   Select your project (JaayNdougou)"
vercel link

echo ""
echo "📝 Step 3: Setting Environment Variables"
echo "========================================"
echo ""

# Function to add env var
add_env() {
    local name=$1
    local value=$2
    local environments=${3:-"production,preview,development"}
    
    echo "Setting: $name"
    echo "$value" | vercel env add "$name" $environments --force
}

# Read values from .env.vercel.local
source .env.vercel.local

# Set variables
echo "🔹 Database variables..."
add_env "DATABASE_URL" "$DATABASE_URL"
add_env "DIRECT_URL" "$DIRECT_URL"

echo ""
echo "🔹 NextAuth variables..."
add_env "NEXTAUTH_URL" "$NEXTAUTH_URL" "production"
add_env "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"

echo ""
echo "🔹 Public configuration..."
add_env "NEXT_PUBLIC_WHATSAPP_NUMBER" "$NEXT_PUBLIC_WHATSAPP_NUMBER"
add_env "NEXT_PUBLIC_SITE_URL" "$NEXT_PUBLIC_SITE_URL"
add_env "NEXT_PUBLIC_SITE_NAME" "$NEXT_PUBLIC_SITE_NAME"

echo ""
echo "🔹 Admin configuration..."
add_env "ADMIN_EMAIL" "$ADMIN_EMAIL"
add_env "INITIAL_ADMIN_PASSWORD" "$INITIAL_ADMIN_PASSWORD"

# Optional variables
if [ ! -z "$RESEND_API_KEY" ]; then
    echo ""
    echo "🔹 Email configuration..."
    add_env "RESEND_API_KEY" "$RESEND_API_KEY"
fi

if [ ! -z "$WAVE_API_KEY" ]; then
    echo ""
    echo "🔹 Wave payment configuration..."
    add_env "WAVE_API_KEY" "$WAVE_API_KEY"
    add_env "WAVE_MERCHANT_NUMBER" "$WAVE_MERCHANT_NUMBER"
fi

if [ ! -z "$ORANGE_MONEY_API_KEY" ]; then
    echo ""
    echo "🔹 Orange Money payment configuration..."
    add_env "ORANGE_MONEY_API_KEY" "$ORANGE_MONEY_API_KEY"
    add_env "ORANGE_MONEY_MERCHANT_NUMBER" "$ORANGE_MONEY_MERCHANT_NUMBER"
fi

echo ""
echo "=================================================="
echo "✅ All environment variables have been set!"
echo ""
echo "📝 Next Steps:"
echo "   1. Deploy to production: vercel --prod"
echo "   2. Create admin account: node scripts/seed-admin.js"
echo "   3. Test login at: https://jaayndougou.app/login"
echo ""
echo "=================================================="
