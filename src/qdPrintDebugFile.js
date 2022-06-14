import fs from 'node:fs';
import FsPath from 'node:path';
import os from 'node:os';
import processNewlineDelimitedFile from './processNewlineDelimitedFile.js';
import zlib from 'node:zlib';

const file = FsPath.join(os.homedir(), 'queueshareData', 'debuggingInfo');

await processNewlineDelimitedFile(file, (infoAsJson) => {

    const info = JSON.parse(infoAsJson);

    // if (info.value.kind === 'qsHttpServerReq') {
    
        // console.log(info.value.value.url);
    
    // }

    // if (info.value.kind === 'qsHttpServerUpgradeReq') {
    
    //     console.log(info.value.value);        
    
    // }

    // if (info.value.kind === 'qsInfo') {
    
    //     console.log(info.value);
    
    // }

    // if (info.value.kind === 'qsWriteDebuggingInfoReqInfo') {
    
    //     const reqInfo = info.value.value;

    //     const reqBodyAsBuffer = Buffer.from(reqInfo.body, 'base64');

    //     const reqBody = JSON.parse(reqBodyAsBuffer.toString());

    //     console.log(reqBody);
    
    // }

    // if (info.value.kind === 'qsInfo') {
    
    //     console.log(info);        
    
    // }

    // if (info.value.kind === 'qsYtAudioInfoInfo') {

    //     console.log({url: info.value.value.url});

    //     // if (info.value.value.threw) {
        
    //     //     console.log(info.value.value.video);
        
    //     // }
    // }

    // if (info.value.kind === 'qsYtResultsInfo') {
    
    //     console.log(info.value.value.throwee);
    
    // }

    // if (info.kind === 'qsNpmUpdateInfo') {
    
    //     console.log(info.value.value);
    
    // }

    // if (info.kind === 'qsInfo') {
    
    //     console.log(info);
    
    // }

    if (info.kind === 'qsYtResultsInfo') {
    
        if (info.value.threw) {
        
            console.log(info.value.throwee);
        
        }
    
    }

});
