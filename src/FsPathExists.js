import fs from 'node:fs';

const FsPathExists = (path) => {

    return new Promise((resolve, reject) => {

        fs.access(path, (error) => {
        
           if (error) {
            
                if (error.code === 'ENOENT') {
                
                    resolve(false);
                
                }
                else {
                
                    reject(error);
                
                }
            
            }
            else {
            
                resolve(true);
            
            }
        
        });

    });

};

export default FsPathExists;
