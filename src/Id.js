import assert from './assert.js';
import IsId from './IsId.js';

const Id = (value) => {

    assert(IsId(value));

    return value;

};

export default Id;
