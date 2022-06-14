'use strict';

const ChildProcess = require('node:child_process');
const FsPath = require('node:path');

const Qp = (options) => {

    (async () => {    

        console.log('Setting up...');

        options = JSON.parse(JSON.stringify(options));

        let sequenceIndex = 0;

        while (true) {

            const childProcess = ChildProcess.fork(FsPath.join(__dirname, 'qs.js'), [JSON.stringify({options, sequenceIndex})]);

            const exitCode = await new Promise((resolve, reject) => {

                childProcess.on('exit', resolve);

            });

            if (exitCode !== 90) {

                break;
            
            }

            sequenceIndex++;

        }

    })();

};

module.exports = Qp;
