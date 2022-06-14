const HttpServerReqAsJsonValue = (req) => {

    return {complete: req.complete, httpVersion: req.httpVersion, method: req.method, rawHeaders: req.rawHeaders, rawTrailers: req.rawTrailers, url: req.url};

};

export default HttpServerReqAsJsonValue;
