FROM php:8.2-apache

# 1. Install system dependencies for PostgreSQL
RUN apt-get update && \
    apt-get install -y libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# 2. Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql

# Copy your application files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Enable Apache rewrite module
RUN a2enmod rewrite

# Adjust permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80