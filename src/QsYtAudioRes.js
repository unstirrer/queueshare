import assert from './assert.js';
import HttpResAsJsonValue from './HttpResAsJsonValue.js';
import HttpsGetRes from './HttpsGetRes.js';
import IsId from './IsId.js';
import qsWriteDebuggingInfo from './qsWriteDebuggingInfo.js';
import ThroweeAsJsonValue from './ThroweeAsJsonValue.js';

const QsYtAudioRes = async (uri) => {

    let res;

    let threw = false;

    let throwee;

    try {

        res = await HttpsGetRes(uri);

        assert(res.statusCode === 200);

        assert(IsId(res.headers['content-type']));

        assert(res.headers['content-encoding'] === undefined);

    } catch (caughtThrowee) {

        threw = true;
        
        throwee = caughtThrowee;

    }

    qsWriteDebuggingInfo('qsYtAudioResInfo', {res: res === undefined? null : HttpResAsJsonValue(res), threw, throwee: threw? ThroweeAsJsonValue(throwee) : null, uri});

    if (threw) {
    
        if (res !== undefined) {
        
            res.destroy();
        
        }

        return undefined;
    
    }

    return res;

};

export default QsYtAudioRes;
