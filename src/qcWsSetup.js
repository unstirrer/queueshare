import qcsCollabMap from './qcsCollabMap.js';
import qcSetupArg from './qcSetupArg.js';
import Queue from './Queue.js';
import wait from './wait.js';

let {qsCollabMapTime} = qcSetupArg;

const {qsCollabThread} = qcSetupArg;

let currentWs, currentWsUnconfirmedCollabMapOps;

const collabMapOpsToSync = new Map();

(async () => {

    while (true) {

        const ws = new WebSocket(`ws://${location.host}/qcWs?${new URLSearchParams({qsCollabMapTime, qsCollabThread})}`);

        currentWs = ws;

        const wsUnconfirmedCollabMapOps = new Queue();

        currentWsUnconfirmedCollabMapOps = wsUnconfirmedCollabMapOps;

        let wsHasOpened = false;
                
        await new Promise((resolve, reject) => {

            ws.addEventListener('open', () => {

                wsHasOpened = true;

                for (const op of collabMapOpsToSync.values()) {

                    ws.send(JSON.stringify({kind: 'collabMapOp', value: op}));

                    wsUnconfirmedCollabMapOps.append(op);

                }

                let wsHasReceivedMessageSinceLastPing = false;

                (async () => {

                    while (true) {

                        ws.send(JSON.stringify({kind: 'ping', value: null}));
                    
                        await wait(1000);

                        if (ws.readyState !== 1) {

                            resolve();
                        
                            break;
                        
                        }

                        if (!wsHasReceivedMessageSinceLastPing) {
                        
                            ws.close();

                            resolve();

                            break;
                        
                        }

                        wsHasReceivedMessageSinceLastPing = false;
                    
                    }

                })();

                ws.addEventListener('message', (messageEvent) => {

                    wsHasReceivedMessageSinceLastPing = true;

                    const {kind, value} = JSON.parse(messageEvent.data);

                    if (kind === 'collabMapCatchUpOp') {
                    
                        qcsCollabMap.receive(value);
                    
                    }
                    else if (kind === 'collabMapCatchUpTime') {
                    
                        qsCollabMapTime = value;
                    
                    }
                    else if (kind === 'collabMapOp') {
                    
                        qcsCollabMap.receive(value);

                        qsCollabMapTime++;
                    
                    }
                    else if (kind === 'collabMapOpConfirmation') {
                    
                        const op = wsUnconfirmedCollabMapOps.firstValue();

                        wsUnconfirmedCollabMapOps.deleteFirstValue();

                        if (collabMapOpsToSync.get(op.key) === op) {
                        
                            collabMapOpsToSync.delete(op.key);
                        
                        }
                    
                    }
                    else if (kind === 'ping') {
                    
                        ws.send(JSON.stringify({kind: 'pong', value: null}));
                    
                    }
                    else if (kind === 'qsCollabThreadMismatch') {
                    
                        location.reload();
                    
                    }

                });
            
            });

            ws.addEventListener('close', () => {
            
                if (wsHasOpened) {
                
                    resolve();
                
                }
                else {
                
                    setTimeout(resolve, 1000);
                
                }
            
            });
        
        });

    }

})();

const handleNewCollabMapOp = (op) => {

    if (qcsCollabMap.localOps.has(op)) {

        collabMapOpsToSync.set(op.key, op);

        if (currentWs.readyState === 1) {

            currentWs.send(JSON.stringify({kind: 'collabMapOp', value: op}));

            currentWsUnconfirmedCollabMapOps.append(op);

        }

    }    

};

for (const op of qcsCollabMap.ops.values()) {

    handleNewCollabMapOp(op);

}

qcsCollabMap.changeHandlers.push((change) => {

    handleNewCollabMapOp(change.op);

});
