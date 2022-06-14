import collabThread from './collabThread.js';
import fs from 'node:fs';
import FsPath from 'node:path';
import perfHooks from 'node:perf_hooks';
import processNewlineDelimitedFile from './processNewlineDelimitedFile.js';
import qsDataDir from './qsDataDir.js';
import Queue from './Queue.js';

const file = FsPath.join(qsDataDir, 'debuggingInfo');

await (async () => {

    await fs.promises.appendFile(file, '');

    let length = 0;

    const lines = new Queue();

    await processNewlineDelimitedFile(file, (line) => {

        length += line.length;

        lines.append(line);

        while (length > 10000000) {
        
            length -= lines.firstValue().length;

            lines.deleteFirstValue();
        
        }
    
    });

    let newFileContents = '';

    while (!lines.isEmpty()) {

        newFileContents += lines.firstValue() + '\n';

        lines.deleteFirstValue();

    }    

    const tempFile = FsPath.join(qsDataDir, 'tempDebuggingInfo');

    await fs.promises.writeFile(tempFile, newFileContents);

    await fs.promises.rename(tempFile, file);

})();

const fileAppendStream = fs.createWriteStream(file, {flags: 'a'});

const qsWriteDebuggingInfo = (kind, value) => {

    fileAppendStream.write(JSON.stringify({collabThread, kind, performanceNow: perfHooks.performance.now(), stack: (new Error()).stack, value}) + '\n');

};

export default qsWriteDebuggingInfo;
