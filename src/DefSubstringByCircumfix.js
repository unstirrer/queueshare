import assert from './assert.js';

const DefSubstringByCircumfix = (string, prefix, suffix) => {

    const prefixIndex = string.indexOf(prefix);

    assert(prefixIndex !== -1);

    const substringIndex = prefixIndex + prefix.length;

    const suffixIndex = string.indexOf(suffix, substringIndex);

    assert(suffixIndex !== -1);

    return string.slice(substringIndex, suffixIndex);              

};

export default DefSubstringByCircumfix;
