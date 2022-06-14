const httpServeFile = (fileReadStream, res) => {
    
    fileReadStream.pipe(res);

    res.on('close', () => {

        if (fileReadStream.readable) {

            fileReadStream.destroy();

        }
    
    });

};

export default httpServeFile;
