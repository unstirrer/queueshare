import collabThread from './collabThread.js';
import ParsedRelativeUri from './ParsedRelativeUri.js';
import qcsCollabMap from './qcsCollabMap.js';
import qsCollabMapTimer from './qsCollabMapTimer.js';
import qsResetMaintenanceTimeout from './qsResetMaintenanceTimeout.js';
import wait from './wait.js';
import {WebSocketServer} from 'ws';

const qsQcWsServer = new WebSocketServer({noServer: true});

const clientsWithMatchingQsCollabThreads = new WeakSet();

qsQcWsServer.on('connection', (client, req) => {

    const {searchParams} = ParsedRelativeUri(req.url);

    if (searchParams.get('qsCollabThread') === collabThread) {

        clientsWithMatchingQsCollabThreads.add(client);

        const {opTimes} = qsCollabMapTimer;

        const qcTime = Number(searchParams.get('qsCollabMapTime'));

        for (const op of qcsCollabMap.ops.values()) {
        
            if (opTimes.get(op) >= qcTime) {

                client.send(JSON.stringify({kind: 'collabMapCatchUpOp', value: op}));
            
            }
        
        }

        const {time} = qsCollabMapTimer;
        
        client.send(JSON.stringify({kind: 'collabMapCatchUpTime', value: time}));        

    }
    else {
    
        client.send(JSON.stringify({kind: 'qsCollabThreadMismatch', value: null}));
    
    }

    let clientHasReceivedMessageSinceLastPing = false;

    (async () => {

        while (true) {

            client.send(JSON.stringify({kind: 'ping', value: null}));
        
            await wait(10000);

            if (client.readyState !== 1) {
            
                break;
            
            }

            if (!clientHasReceivedMessageSinceLastPing) {
            
                client.close();

                break;
            
            }

            clientHasReceivedMessageSinceLastPing = false;
        
        }

    })();

    client.on('message', (messageAsBuffer) => {

        clientHasReceivedMessageSinceLastPing = true;

        const {kind, value} = JSON.parse(messageAsBuffer.toString());

        if (kind === 'collabMapOp') {

            if (clientsWithMatchingQsCollabThreads.has(client)) {
            
                qcsCollabMap.receive(value);

                qsResetMaintenanceTimeout();

                client.send(JSON.stringify({kind: 'collabMapOpConfirmation', value: null}));
            
            }

        }
        else if (kind === 'ping') {
        
            client.send(JSON.stringify({kind: 'pong', value: null}));
        
        }
    
    });

});

qcsCollabMap.changeHandlers.push((change) => {

    for (const client of qsQcWsServer.clients) {
     
        if (client.readyState === 1) {

            if (clientsWithMatchingQsCollabThreads.has(client)) {

                client.send(JSON.stringify({kind: 'collabMapOp', value: change.op}));    
            
            }
        
        }
     
    } 

});

export default qsQcWsServer;
