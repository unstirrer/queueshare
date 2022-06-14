import collabThread from './collabThread.js';
import IncCollabIdInt from './IncCollabIdInt.js';

let time = '00000';

const CollabId = () => {

    const id = collabThread + time;

    time = IncCollabIdInt(time);

    return id;

};

export default CollabId;
