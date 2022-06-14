import collabThread from './collabThread.js';
import DecCollabIdInt from './DecCollabIdInt.js';
import IncCollabIdInt from './IncCollabIdInt.js';

let time = '00000';

const Sibling = (position, i, sign) => {

    const int = position.slice(i+13, i+18);

    const sibling = position.slice(0, i+13) + (sign === 1? IncCollabIdInt(int) : DecCollabIdInt(int)) + time + '1';

    time = IncCollabIdInt(time);

    return sibling;

};

const Child = (position, sign) => {

    const child = (sign === 1? position : position.slice(0, -1) + '0') + collabThread + 'I0000' + time + '1';

    time = IncCollabIdInt(time);

    return child;

};

const SiblingOrChild = (position, i, sign) => {

    for (let j = i; j < position.length; j += 24) {
    
        if (position.slice(j, j+13) === collabThread) {
        
            return Sibling(position, j, sign);
        
        }        
    
    }

    return Child(position, sign);

};

const CollabPosition = (after, before) => {

    const minLength = Math.min(after.length, before.length);

    for (let i = 0; i < minLength; i += 24) {

        const afterThread = after.slice(i, i+13);

        const beforeThread = before.slice(i, i+13);
    
        if (afterThread !== beforeThread) {
        
            if (afterThread === collabThread) {
            
                return Sibling(after, i, 1);
            
            }

            if (beforeThread === collabThread) {
            
                return Sibling(before, i, -1);
            
            }

        }
    
    }
    
    if (after.length > before.length) {

        return SiblingOrChild(after, before.length, 1);

    }
    
    if (before.length > after.length) {

        return SiblingOrChild(before, after.length, -1);
    
    }

    return Child(after, 1);

};

export default CollabPosition;
