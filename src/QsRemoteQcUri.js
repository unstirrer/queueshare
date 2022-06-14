import os from 'node:os';
import qsWriteDebuggingInfo from './qsWriteDebuggingInfo.js';

const QsRemoteQcUri = () => {

    const interfaces = os.networkInterfaces();

    qsWriteDebuggingInfo('qsRemoteQcUriOsNetworkInterfaces', interfaces);

    const matchingDescriptor = Object.values(interfaces).flat().find((descriptor) => {

        return descriptor.family === 'IPv4' && !descriptor.internal;

    });

    return matchingDescriptor === undefined? '' : `http://${matchingDescriptor.address}:29749`;

};

export default QsRemoteQcUri;
