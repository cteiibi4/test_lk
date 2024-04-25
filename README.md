1. Create .env file with variables below:

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgresqlpassword
POSTGRES_DB=buncha-db
POSTGRES_HOSTNAME=postgres
ALLOWED_HOSTS=*
SECRET_KEY=django-insecure-)7*l@htqo#2nq@7l8=ua5gh+sd9bzwmmmd$n#vx0=8$62(a82@

2. Add database snap to ~/initdb/your_snap

3. Run project:

docker-compose up -d