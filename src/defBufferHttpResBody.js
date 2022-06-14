const defBufferHttpResBody = (res) => {

    return new Promise((resolve, reject) => {

        const chunks = [];

        res.on('data', (chunk) => {
        
            chunks.push(chunk);
        
        });

        res.on('end', () => {
        
            resolve(Buffer.concat(chunks));
        
        });

        res.on('error', reject);        
    
    });

};

export default defBufferHttpResBody;
