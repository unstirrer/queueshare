import qcWriteDebuggingInfo from './qcWriteDebuggingInfo.js';
import ThroweeAsJsonValue from './ThroweeAsJsonValue.js';

const qcFetchJsonFromQs = async (resource, init) => {

    try {

        const response = await fetch(resource, init);

        return response.ok? (await response.json()) : undefined;
    
    } catch (throwee) {

        qcWriteDebuggingInfo('qcFetchJsonFromQsThrowee', ThroweeAsJsonValue(throwee));
        
        return undefined;
    
    }

};

export default qcFetchJsonFromQs;
