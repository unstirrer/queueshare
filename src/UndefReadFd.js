import fs from 'node:fs';

const UndefReadFd = (file) => {

    return new Promise((resolve, reject) => {

        fs.open(file, (error, fd) => {
        
           if (error) {
            
                if (error.code === 'ENOENT') {
                
                    resolve(-1);
                
                }
                else {
                
                    reject(error);
                
                }
            
            }
            else {
            
                resolve(fd);
            
            }
        
        });    
    
    });

};

export default UndefReadFd;
