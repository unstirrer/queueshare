const HttpResAsJsonValue = (res) => {

    return {complete: res.complete, httpVersion: res.httpVersion, rawHeaders: res.rawHeaders, rawTrailers: res.rawTrailers, statusCode: res.statusCode, statusMessage: res.statusMessage};

};

export default HttpResAsJsonValue;
