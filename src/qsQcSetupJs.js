import fs from 'node:fs';
import FsPath from 'node:path';
import qsArg from './qsArg.js';
import qsPackage from './qsPackage.cjs';

const file = FsPath.join(qsPackage, 'dist', 'qcSetup.js');

if (qsArg.options.dev) {

    const [commonjsModule, {nodeResolve}, {rollup}] = await Promise.all([import('@rollup/plugin-commonjs'), import('@rollup/plugin-node-resolve'), import('rollup')]);

    const bundle = await rollup({input: FsPath.join(qsPackage, 'src', 'qcSetup.js'), plugins: [commonjsModule.default(), nodeResolve({browser: true})]});

    await bundle.write({file, format: 'es'});

    bundle.close();

}

const qsQcSetupJs = await fs.promises.readFile(file, {encoding: 'utf8'});

export default qsQcSetupJs;
