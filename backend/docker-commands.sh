sudo docker build -t nova-backend . --no-cache
sudo docker rm nova-container
sudo docker run -d -p 5000:5000 --env-file .env --name nova-container nova-backend
sudo docker logs nova-container