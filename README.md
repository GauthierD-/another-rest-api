# another-rest-api
Testing REST API


## How to build and launch

```cli
docker build -t another-rest-api .
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```

## Run tests
/!\ need moar tests /!\
```cli
docker-compose -f docker-compose.test.yml up
```

### /!\ Warning /!\
Something mongodb service is not up when our application try to connect on DB.  
You have to generate a 'save' event inside src folder to reload another-rest-api.


## Routes
* current version: `v1`
* multi entrypoints: `/games` - `/publishers` - `/secret-process`

#### Publishers

HTTP Method | Entry point | Description | Body
----------- | ----------- | ----------- | ----
[GET] | `/v1/publishers` | Get all publishers |
[GET] | `/v1/publishers?name=zelda` | Get all publishers that contains `zelda` |
[GET] | `/v1/publishers/:id` | Get one publisher by ID | 
[POST] | `/v1/publishers` | Create publisher | ```{ name: string; siret: number; phone: number }```

#### Games

HTTP Method | Entry point | Description | Body
----------- | ----------- | ----------- | ----
[GET] | `/v1/games` | Get all games | 
[GET] | `/v1/games/:id` | Get one games by ID | 
[POST] | `/v1/publishers` | Create game | ```{ title: string;  price: number; publisher: PublisherId; tags: string[]; releaseDate: string }```
[PATCH] | `/v1/publishers/:id` | Update game | ```{ title: string;  price: number; publisher: PublisherId; tags: string[]; releaseDate: string }```
[DELETE] | `/v1/publishers/:id` | Delete game by id | 

#### Secret-process

HTTP Method | Entry point | Description | Body
----------- | ----------- | ----------- | ----
[POST] | `/v1/secret-process` | Delete game older than 18 months and discount of 20% to all games having a release date between 12 and 18 months. | 
