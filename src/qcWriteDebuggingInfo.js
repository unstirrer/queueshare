import collabThread from './collabThread.js';

let time = 0;

const qcWriteDebuggingInfo = (kind, value) => {

    return fetch('/writeDebuggingInfo', {body: JSON.stringify({collabThread, kind, performanceNow: performance.now(), stack: (new Error()).stack, time: time++, value}), method: 'POST'});    

};

export default qcWriteDebuggingInfo;
