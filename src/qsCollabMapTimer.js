import qcsCollabMap from './qcsCollabMap.js';

const qsCollabMapTimer = {opTimes: new WeakMap(), time: 0};

const handleNewOp = (op) => {

    qsCollabMapTimer.opTimes.set(op, qsCollabMapTimer.time++);
    
};

for (const op of qcsCollabMap.ops.values()) {

    handleNewOp(op);

}

qcsCollabMap.changeHandlers.push((change) => {

    handleNewOp(change.op);

});

export default qsCollabMapTimer;
