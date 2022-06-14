import assert from './assert.js';

const DecCollabIdInt = (collabIdInt) => {

    assert(collabIdInt !== '00000');

    let i = 4;

    while (true) {

        if (collabIdInt[i] !== '0') {

            return collabIdInt.slice(0, i) + (collabIdInt[i] === 'A'? '9' : String.fromCharCode(collabIdInt.charCodeAt(i)-1)) + 'Z'.repeat(4 - i);
                
        }
 
        i--;
    
    }

};

export default DecCollabIdInt;
