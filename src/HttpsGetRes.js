import https from 'node:https';

const HttpsGetRes = (uri, options) => {

    return new Promise((resolve, reject) => {

        const req = https.get(uri, options);

        req.on('response', resolve);

        req.on('error', reject);        
    
    });

};

export default HttpsGetRes;
