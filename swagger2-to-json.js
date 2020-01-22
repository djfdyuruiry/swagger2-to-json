var fs = require("fs")
var request = require("sync-request")

var Swagger2Object = require("swagger2-to-object"); 

const toJson = (obj, opts) => 
    (opts && opts.prettyPrint) ? JSON.stringify(obj, null, 4) : JSON.stringify(obj)

/* module function chain */
function convertSwagger (swaggerSpec, convertSwaggerOptions) {
    var objGenerator = Swagger2Object.generateObjects().for();
    var requestsAndResponses = () => objGenerator.specSchemas(swaggerSpec, convertSwaggerOptions);
    var requests = () => objGenerator.specRequests(swaggerSpec, convertSwaggerOptions);
    var responses = () => objGenerator.specResponses(swaggerSpec, convertSwaggerOptions);

    return { 
        requestsAndResponses: () => ({
            toMap: () => requestsAndResponses(),
            toJson: () => toJson(requestsAndResponses()),
            toJsonFile: filename => fs.writeFileSync(filename, toJson(requestsAndResponses()))
        }),
        requests: () => ({
            toMap: () => requests(),
            toJson: () => toJson(requests()),
            toJsonFile: filename => fs.writeFileSync(filename, toJson(requests()))
        }),
        responses:  () => ({
            toMap: () => responses(),
            toJson: () => toJson(responses()),
            toJsonFile: filename => fs.writeFileSync(filename, toJson(responses()))
        }),
    }
}

function convertSwaggerJson (swaggerJson, convertSwagger, options) {
    if (options && options.debug) {
        console.log(`Parsing Swagger spec JSON...`);
    }

    var swaggerSpec = JSON.parse(swaggerJson);
    return convertSwagger(swaggerSpec, options);
}

/* module export */
module.exports = {
    convertSwagger: () => ({ 
        fromUrl: (url, options) => {
            if (options && options.debug) {
                console.log(`Reading Swagger spec from URL: ${url}...`);
            }

            var response = request("GET", url);
            var swaggerJson = response.getBody();

            return convertSwaggerJson(swaggerJson, convertSwagger, options);
        },
        fromFile: (filePath, options) => {
            if (options && options.debug) {
                console.log(`Reading Swagger spec from file: ${filePath}...`);
            }
            
            var swaggerJson = fs.readFileSync(filePath);

            return convertSwaggerJson(swaggerJson, convertSwagger, options);
        },
        fromJson: (swaggerSpecJson, options) => convertSwaggerJson(swaggerJson, convertSwagger, options),
        fromSpec: (swaggerSpec, options) => convertSwagger(swaggerSpec, options)
    })
};
