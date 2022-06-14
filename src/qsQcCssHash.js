import crypto from 'node:crypto';
import qsQcCss from './qsQcCss.js';

const cryptoHash = crypto.createHash('sha256');

cryptoHash.update(qsQcCss);

const qsQcCssHash = cryptoHash.digest('hex');

export default qsQcCssHash;
