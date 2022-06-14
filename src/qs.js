import ChildProcess from 'node:child_process';
import DateAsJsonValue from './DateAsJsonValue.js';
import fs from 'node:fs';
import FsPath from 'node:path';
import qsArg from './qsArg.js';
import qsDataDir from './qsDataDir.js';
import qsPackage from './qsPackage.cjs';
import qsResetMaintenanceTimeout from './qsResetMaintenanceTimeout.js';
import qsWriteDebuggingInfo from './qsWriteDebuggingInfo.js';
import replaceQs from './replaceQs.js';
import ThroweeAsJsonValue from './ThroweeAsJsonValue.js';

import './qsCollabMapSetup.js';
import './qsHttpServerSetup.js';

qsResetMaintenanceTimeout();

qsWriteDebuggingInfo('qsInfo', {date: DateAsJsonValue(new Date()), processArch: process.arch, processArgv: process.argv, processArgv0: process.argv0, processCwd: process.cwd(), processEnv: process.env, processExecArgv: process.execArgv, processPlatform: process.platform, processVersions: process.versions, qsDataDir});

if (qsArg.options.dev) {

    (async () => {

        (await import('chokidar')).watch(qsPackage, {ignored: [/[\/\\]\./, /[\/\\]node_modules[\/\\]/], ignoreInitial: true}).on('all', replaceQs);

    })();

}

(async () => {

    const PackageVersion = async () => {

        return JSON.parse(await fs.promises.readFile(FsPath.join(qsPackage, 'package.json'), {encoding: 'utf8'})).version;

    };

    const initialPackageVersion = await PackageVersion();

    qsWriteDebuggingInfo('qsInitialPackageVersion', initialPackageVersion);

    if (!qsArg.options.dev) {

        ChildProcess.execFile('npm', ['update', 'queueshare', '--loglevel', 'silly'], {cwd: FsPath.join(qsPackage, '..', '..')}, async (error, stdout, stderr) => {

            qsWriteDebuggingInfo('qsNpmUpdateInfo', {error: error? ThroweeAsJsonValue(error) : null, stderr, stdout});

            if ((await PackageVersion()) !== initialPackageVersion) {

                replaceQs();

            }
        
        });

    }

})();

if (qsArg.sequenceIndex === 0) {

    console.log('QueueShare is now available at http://localhost:29749');    

}
