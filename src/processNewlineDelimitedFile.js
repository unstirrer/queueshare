import fs from 'node:fs';

const processNewlineDelimitedFile = (file, fnThatNeverThrows) => {

    return new Promise((resolve, reject) => {

        const readStream = fs.createReadStream(file, {encoding: 'utf8'});
        
        let currentLineStart = '';

        readStream.on('data', (chunk) => {

            const splitChunk = chunk.split('\n');

            for (let i = 0; i < splitChunk.length-1; i++) {

                fnThatNeverThrows(currentLineStart + splitChunk[i]);

                currentLineStart = '';
            
            }
            
            currentLineStart += splitChunk[splitChunk.length-1];
            
        });

        readStream.on('end', resolve);

        readStream.on('error', reject);

    });

};

export default processNewlineDelimitedFile;
