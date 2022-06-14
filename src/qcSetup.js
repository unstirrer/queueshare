import DateAsJsonValue from './DateAsJsonValue.js';
import qcsCollabMap from './qcsCollabMap.js';
import qcSetupArg from './qcSetupArg.js';
import qcWriteDebuggingInfo from './qcWriteDebuggingInfo.js';
import ThroweeAsJsonValue from './ThroweeAsJsonValue.js';

import './qcDomSetup.js';
import './qcWsSetup.js';

addEventListener('error', async (errorEvent) => {

    try {

        await qcWriteDebuggingInfo('qcError', ThroweeAsJsonValue(errorEvent.error));
    
    } catch (throwee) {
    
    }

});

addEventListener('unhandledrejection', async (promiseRejectionEvent) => {

    try {

        await qcWriteDebuggingInfo('qcPromiseRejectionReason', ThroweeAsJsonValue(promiseRejectionEvent.reason));
    
    } catch (throwee) {
    
    }

});

qcWriteDebuggingInfo('qcInfo', {date: DateAsJsonValue(new Date()), locationHref: location.href, navigatorUserAgent: navigator.userAgent, qcSetupArgQsCollabThread: qcSetupArg.qsCollabThread});

for (const op of qcSetupArg.collabMapOps) {

    qcsCollabMap.receive(op);

}
