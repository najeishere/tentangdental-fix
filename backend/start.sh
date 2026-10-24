#!/bin/sh
set -e

# Cach konfigurasi/route produksi (package:discover sudah dijalankan saat build)
mkdir -p database
touch database/database.sqlite
php artisan optimize

# Jalankan migrasi (idempotent); seed hanya bila APP_SEED=true
php artisan migrate --force
if [ "${APP_SEED:-false}" = "true" ]; then
  php artisan db:seed --force
fi

exec apache2-foreground
