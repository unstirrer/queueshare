import zlib from 'node:zlib';

const Gzipped = (data) => {

    return new Promise((resolve, reject) => {

        zlib.gzip(data, (error, gzippedData) => {
        
            if (error) {
            
                reject(error);
            
            }
            else {
            
                resolve(gzippedData);
            
            }
        
        });

    });

};

export default Gzipped;
