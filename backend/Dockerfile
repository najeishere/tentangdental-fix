FROM php:8.3-apache

# Ekstensi yang dibutuhkan Laravel + dompdf
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libicu-dev libpng-dev libfreetype6-dev \
        libjpeg-dev libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql mbstring intl gd zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

# Dependensi produksi + autoload
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress \
    && php artisan storage:link \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["./start.sh"]