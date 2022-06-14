const sendHttpResBodyToFile = (res, fileWriteStream) => {
    
    res.pipe(fileWriteStream);

    res.on('error', () => {

        if (fileWriteStream.writable) {

            fileWriteStream.destroy();

        }
    
    });

};

export default sendHttpResBodyToFile;
