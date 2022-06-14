import replaceQs from './replaceQs.js';

let timeout;

const qsResetMaintenanceTimeout = () => {

    if (timeout !== undefined) {

        clearTimeout(timeout);        
    
    }

    timeout = setTimeout(replaceQs, 10000000);

};

export default qsResetMaintenanceTimeout;
