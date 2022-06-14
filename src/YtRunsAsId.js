import assert from './assert.js';
import Id from './Id.js';

const YtRunsAsId = (runs) => {

    for (const run of runs) {
    
        assert(typeof run.text === 'string');
    
    }

    return Id(runs.map((run) => {
    
        return run.text;
    
    }).join(''));

};

export default YtRunsAsId;
