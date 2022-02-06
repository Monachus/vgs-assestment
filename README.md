About
-----
This is an example application using Node.js & Vue.js to integrate against Very Good Security's vault service in Sandbox mode. In order to receive the redacted payload the application is exposed to the internet using [ngrok](https://ngrok.com/)

Prerequisites
-------------
In order to test this service you should have 
* [Docker Compose](https://github.com/docker/compose) installed on your machine.
* A Sandbox account at [VGS](https://dashboard.verygoodsecurity.com/)
* A ngrok account (optional though you will need to change the docker-compose.yml to use port 80)

Getting Started
---------------
Create some access credentials at https://dashboard.verygoodsecurity.com/dashboard > Administration > Vault Settings > Access Credentials

Create an .env file, you can do this by making a copy of the example.env provided.
```bash
cp example.env .env
```
Modify your .env file to include your access credentials.
```.env
VGS_VAULT_USERNAME=<username>
VGS_VAULT_PASSWORD=<password>
```

Modify your ngrok.env file to include your auth token. If you have a non free ngrok account you can also set your subdomain via this .env file
```ngrok.env
AUTH_TOKEN=<ngrok-token>
#SUBDOMAIN=jimmy-ventura
```
Now it is time to build and start our images using docker compose
```bash
docker-compose build
docker-compose up -d
```

Once your containers are up and running navigate to http://localhost:4551/ to obtain the randomly generated ngrok URL. We will be creating two routes, an inbound and an outbound. for both we will redact/reveal $.cardNumber & $.ccv JSON paths. Go to [VGS](https://dashboard.verygoodsecurity.com/) and create an inbound route. The upstream host is the ngrok URL, with a filter the matches the path **/backend-api** and a Content Type of **application/json**. We will be testing the reveal operation so go ahead and create an outbound route with the upstream host https://echo.apps.verygood.systems. 

Finally open the url shown on http://localhost:4551/ and play around with different values.

