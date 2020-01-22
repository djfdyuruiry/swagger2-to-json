# swagger2-to-json #

A simple interface for converting Swagger v2 JSON spec requests/responses to JSON samples.

Features:

- Import Swagger Spec direct from URL, JSON file, raw JSON string and JavaScript object 

- Export request/response sample JSON to string and file

NPM Package: https://www.npmjs.com/package/swagger2-to-json
GitHub: https://github.com/djfdyuruiry/swagger2-to-json

This package is part of a collection of three Swagger v2 converters I have created:

- swagger2-to-object: 
    [NPM](https://www.npmjs.com/package/swagger2-to-object) | [GitHub](https://github.com/djfdyuruiry/swagger2-to-object)
- swagger2-postman-generator:
    [NPM](https://www.npmjs.com/package/swagger2-postman-generator) | [GitHub](https://github.com/djfdyuruiry/swagger2-postman-generator)

---

## Install ##

``` shell
npm install swagger2-to-json
```

---


## Usage ##

This NPM module returns a single object which is used to access a chain of different functions. Import the module like so:

``` javascript
var Swagger2ToJson = require("swagger2-to-json");

Swagger2ToJson
    .convertSwagger()
    // do more stuff...
```

**Import Swagger JSON File**

``` javascript
Swagger2ToJson
    .convertSwagger()
    .fromFile("swagger.json")
```

**Import Swagger JSON String**

``` javascript
Swagger2ToJson
    .convertSwagger()
    .fromJson('{"swagger":"2.0",...')
```

**Import Swagger JavaScript Object**

``` javascript
var swaggerSpec = getSwaggerSpecFromSomewhere(); // example

Swagger2ToJson
    .convertSwagger()
    .fromSpec(swaggerSpec)
```

---

**Output Object**

After importing a Swagger spec, the output object will have the following structure:

``` javascript
    { 
        requestsAndResponses,
        requests,
        responses
    }
```

Each of the keys can be called as a function so you can chain the data for export; see below.

---

**Export to Map**

This will create a map where each request/response schema path is a key.

``` javascript
var requestResponsesMap = Swagger2ToJson
    .convertSwagger()
    .fromUrl("http://petstore.swagger.io/v2/swagger.json")
    .requestsAndResponses()
    .toMap()
```

**Export to JSON**

``` javascript
var collectionJson = Swagger2ToJson
    .convertSwagger()
    .fromUrl("http://petstore.swagger.io/v2/swagger.json")
    .requestsAndResponses()
    .toJson()
```

**Export to JSON File**

``` javascript
Swagger2ToJson
    .convertSwagger()
    .fromFile("swagger.json")
    .responses()
    .toJsonFile("responses.json")
```