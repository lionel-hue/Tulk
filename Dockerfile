FROM php:8.2-apache

# Install PDO and other common extensions
RUN docker-php-ext-install pdo pdo_pgsql

# Copy your application files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Enable Apache rewrite module (for pretty URLs)
RUN a2enmod rewrite

# Adjust permissions for web server
RUN chown -R www-data:www-data /var/www/html

# Expose port 80
EXPOSE 80