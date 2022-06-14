import {customAlphabet} from 'nanoid';

const collabThread = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 13)();

export default collabThread;
