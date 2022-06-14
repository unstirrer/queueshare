const bufferHttpServerReqBody = (req) => {

    return new Promise((resolve, reject) => {

        const chunks = [];

        req.on('data', (chunk) => {
        
            chunks.push(chunk);
        
        });

        req.on('end', () => {
        
            resolve(Buffer.concat(chunks));
        
        });

        req.on('error', () => {
        
            resolve(undefined);
        
        });        
    
    });

};

export default bufferHttpServerReqBody;
