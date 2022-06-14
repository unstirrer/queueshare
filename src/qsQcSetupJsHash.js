import crypto from 'node:crypto';
import qsQcSetupJs from './qsQcSetupJs.js';

const cryptoHash = crypto.createHash('sha256');

cryptoHash.update(qsQcSetupJs);

const qsQcSetupJsHash = cryptoHash.digest('hex');

export default qsQcSetupJsHash;
