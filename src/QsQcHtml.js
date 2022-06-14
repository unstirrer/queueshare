import collabThread from './collabThread.js';
import fs from 'node:fs';
import FsPath from 'node:path';
import qcsCollabMap from './qcsCollabMap.js';
import qsCollabMapTimer from './qsCollabMapTimer.js';
import qsPackage from './qsPackage.cjs';
import qsQcCssHash from './qsQcCssHash.js';
import qsQcSetupJsHash from './qsQcSetupJsHash.js';

import './qsCollabMapSetup.js';

const splitTemplate = (await fs.promises.readFile(FsPath.join(qsPackage, 'src', 'qcTemplate.html'), {encoding: 'utf8'})).split('${}');

const prefix = splitTemplate[0] + qsQcCssHash + splitTemplate[1] + qsQcSetupJsHash + splitTemplate[2];

const suffix = splitTemplate[3];

const QsQcHtml = () => {

    return prefix + JSON.stringify({collabMapOps: [...qcsCollabMap.ops.values()], qsCollabMapTime: qsCollabMapTimer.time, qsCollabThread: collabThread}).replaceAll('<', '\\u003C') + suffix;

};

export default QsQcHtml;
