import fs from 'node:fs';

const FdStats = (fd) => {

    return new Promise((resolve, reject) => {

        fs.fstat(fd, (error, stats) => {
        
           if (error) {
            
                reject(error);
            
            }
            else {
            
                resolve(stats);
            
            }
        
        });

    });

};

export default FdStats;
