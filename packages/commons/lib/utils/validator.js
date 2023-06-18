const { BadRequest } = require("commons/lib/middleware/errors");

function validatorRequestParams(request, requestParams) {
    console.log(request);
    const missingParams = requestParams.filter(params => !Object.keys(request).includes(params));
    
    if (missingParams.length !== 0) {
        const errorMessages = {};
        missingParams.forEach(param => {
            errorMessages[param] = `missing`;
        });
        throw new BadRequest(errorMessages);
    }
}

module.exports = {validatorRequestParams}
