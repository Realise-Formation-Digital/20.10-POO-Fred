FROM php:7.2-apache-stretch

COPY . /var/www/html

WORKDIR /var/www/html

RUN docker-php-ext-install mbstring pdo pdo_mysql \
    && chown -R www-data:www-data /var/www/html