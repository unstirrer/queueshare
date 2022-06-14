import zlib from 'node:zlib';

const Ungzipped = (data) => {

    return new Promise((resolve, reject) => {

        zlib.gunzip(data, (error, ungzippedData) => {
        
            if (error) {
            
                reject(error);
            
            }
            else {
            
                resolve(ungzippedData);
            
            }
        
        });

    });

};

export default Ungzipped;
