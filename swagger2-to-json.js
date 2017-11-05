var fs = require("fs")
var request = require("sync-request")

var Swagger2Object = require("swagger2-to-object"); 

const toJson = (obj, opts) => 
    (opts && opts.prettyPrint) ? JSON.stringify(obj, null, 4) : JSON.stringify(obj)

/* module function chain */
function convertSwagger (swaggerSpec, convertSwaggerOptions) {
    var objGenerator = Swagger2Object.generateObjects().for();
    var requestsAndResponsesJson = () => toJson(objGenerator.specSchemas(swaggerSpec));
    var requestsJson = () => toJson(objGenerator.specRequests(swaggerSpec));
    var responsesJson = () => toJson(objGenerator.specResponses(swaggerSpec));

    return { 
        requestsAndResponses: () => ({
            toJson: (options) => requestsAndResponsesJson(),
            toJsonFile: (filename, options) => fs.writeFileSync(filename, requestsAndResponsesJson())
        }),
        requests: () => ({
            toJson: (options) => requestsJson(),
            toJsonFile: (filename, options) => fs.writeFileSync(filename, requestsJson())
        }),
        responses:  () => ({
            toJson: (options) => responsesJson(),
            toJsonFile: (filename, options) => fs.writeFileSync(filename, responsesJson())
        }),
    }
}

function convertSwaggerJson (swaggerJson, convertSwagger, options) {
    console.log(`Parsing Swagger spec JSON...`);

    var swaggerSpec = JSON.parse(swaggerJson);
    return convertSwagger(swaggerSpec, options);
}

/* module export */
module.exports = {
    convertSwagger: () => ({ 
        fromUrl: (url, options) => {
            console.log(`Reading Swagger spec from URL: ${url}...`);

            var response = request("GET", url);
            var swaggerJson = response.getBody();

            return convertSwaggerJson(swaggerJson, convertSwagger, options);
        },
        fromFile: (filePath, options) => {
            console.log(`Reading Swagger spec from file: ${filePath}...`);

            var swaggerJson = fs.readFileSync(filePath);

            return convertSwaggerJson(swaggerJson, convertSwagger, options);
        },
        fromJson: (swaggerSpecJson, options) => convertSwaggerJson(swaggerJson, convertSwagger, options),
        fromSpec: (swaggerSpec, options) => convertSwagger(swaggerSpec, options)
    })
};
