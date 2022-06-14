import fs from 'node:fs';
import FsPath from 'node:path';
import qsPackage from './qsPackage.cjs';

const qsQcCss = await fs.promises.readFile(FsPath.join(qsPackage, 'src', 'qcCss.css'), {encoding: 'utf8'});

export default qsQcCss;
