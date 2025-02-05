docker build -t nova-backend .
docker run -d -p 5000:5000 --env-file .env --name nova-container nova-backend