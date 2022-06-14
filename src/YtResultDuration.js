import assert from './assert.js';

const YtResultDuration = (string) => {

    const splitString = string.split(':');

    for (const part of splitString) {
    
        assert(/^\d{1,4}$/.test(part));
    
    }

    if (splitString.length === 2) {

        const [minutes, seconds] = splitString.map(Number);
    
        return (60 * minutes) + seconds;
    
    }
    
    if (splitString.length === 3) {

        const [hours, minutes, seconds] = splitString.map(Number);
    
        return (3600 * hours) + (60 * minutes) + seconds;
        
    }
    
    assert(false);

};

export default YtResultDuration;
