# another-rest-api
Testing REST API


## How to build and launch

```cli
docker build -t another-rest-api .
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```

### /!\ Warning /!\
Something mongodb service is not up when our application try to connect on DB.  
You have to generate a 'save' event inside src folder to reload another-rest-api.
