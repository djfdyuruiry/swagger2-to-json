var fs = require("fs")
var Swagger2Object = require("swagger2-to-object"); 

var convertSwaggerRoot = require("./convertSwaggerRoot.js");

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

/* module export */
module.exports = {
    convertSwagger: () => convertSwaggerRoot(convertSwagger)
};
