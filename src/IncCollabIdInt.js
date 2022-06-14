import assert from './assert.js';

const IncCollabIdInt = (collabIdInt) => {

    assert(collabIdInt !== 'ZZZZZ');

    let i = 4;

    while (true) {

        if (collabIdInt[i] !== 'Z') {

            return collabIdInt.slice(0, i) + (collabIdInt[i] === '9'? 'A' : String.fromCharCode(collabIdInt.charCodeAt(i)+1)) + '0'.repeat(4 - i);
                
        }
 
        i--;
    
    }

};

export default IncCollabIdInt;
