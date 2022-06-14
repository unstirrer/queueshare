import fs from 'node:fs';
import FsPath from 'node:path';
import os from 'node:os';
import qsArg from './qsArg.js';

import './qsHttpServerListen.js';

const fakePath = qsArg.options.dataDir === undefined? FsPath.join(os.homedir(), 'queueshareData') : qsArg.options.dataDir;

await fs.promises.mkdir(fakePath, {recursive: true});

const qsDataDir = await fs.promises.realpath(fakePath);

export default qsDataDir;
