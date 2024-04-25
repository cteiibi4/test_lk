#!/bin/sh

echo "Collect static files"
python ./manage.py collectstatic --no-input
echo "Make migrations"
python ./manage.py makemigrations
echo "Apply database migrations"
python ./manage.py migrate --no-input
echo "Start django app"
python ./manage.py runserver "0.0.0.0:8000"
echo "Starting production gunicorn web server"
gunicorn -c deploy/config/gunicorn_config.py