import CollabMap from './CollabMap.js';
import CollabPosition from './CollabPosition.js';
import fs from 'node:fs';
import FsPath from 'node:path';
import processNewlineDelimitedFile from './processNewlineDelimitedFile.js';
import qcsCollabMap from './qcsCollabMap.js';
import QcsMediaExists from './QcsMediaExists.js';
import QcsPlaylistMap from './QcsPlaylistMap.js';
import qcsPlaylistMaps from './qcsPlaylistMaps.js';
import qsDataDir from './qsDataDir.js';
import QsSortedPlaylistMedia from './QsSortedPlaylistMedia.js';

const opsFile = FsPath.join(qsDataDir, 'collabMapOps');

await (async () => {

    await fs.promises.appendFile(opsFile, '');

    const tempCollabMap = new CollabMap();

    await processNewlineDelimitedFile(opsFile, (opAsJson) => {

        tempCollabMap.receive(JSON.parse(opAsJson));
    
    });

    for (const [key, value] of tempCollabMap) {
    
        qcsCollabMap.set(key, value);
    
    }

    for (const playlist of [...qcsPlaylistMaps.keys()]) {

        let previousCompressedPosition = '';

        for (const media of QsSortedPlaylistMedia(playlist)) {

            const infoKey = `media-${media}-playlists-${playlist}-info`;
        
            const compressedPosition = CollabPosition(previousCompressedPosition, '');

            qcsCollabMap.set(infoKey, JSON.stringify({...JSON.parse(qcsCollabMap.get(infoKey)), position: compressedPosition}));

            previousCompressedPosition = compressedPosition;            
        
        }

    }

    const sortedRecentMedia = QsSortedPlaylistMedia('recents');

    for (let i = sortedRecentMedia.length-1; i >= 0; i--) {

        if (QcsPlaylistMap('recents').size <= 10000) {
        
            break;
        
        }

        qcsCollabMap.delete(`media-${sortedRecentMedia[i]}-playlists-recents-info`);
    
    }

    for (const key of [...qcsCollabMap.keys()]) {

        const match = key.match(/^media-([^-]+)/);

        if (match !== null) {
        
            const [, media] = match;

            if (!QcsMediaExists(media)) {

                qcsCollabMap.delete(key);
            
            }
        
        }

    }

    for (const key of [...qcsCollabMap.keys()]) {

        const match = key.match(/^media-[^-]+-playlists-([^-]+)/);

        if (match !== null) {
        
            const [, playlist] = match;

            if (!QcsMediaExists(playlist)) {

                qcsCollabMap.delete(key);

            }
        
        }

    }

    for (const key of [...qcsCollabMap.keys()]) {

        const match = key.match(/^media-([^-]+)-playlists-([^-]+)/);

        if (match !== null) {
        
            const [, media, playlist] = match;

            if (!qcsCollabMap.has(`media-${media}-playlists-${playlist}-info`)) {

                qcsCollabMap.delete(key);

            }
        
        }

    }

    const reachableMedia = new Set(['queue', 'recents']);

    for (const track of QcsPlaylistMap('queue').values()) {

        reachableMedia.add(track);

        const {queuedPlaylist} = JSON.parse(qcsCollabMap.get(`media-${track}-playlists-queue-info`));

        if (queuedPlaylist !== '' && !reachableMedia.has(queuedPlaylist)) {
        
            reachableMedia.add(queuedPlaylist);

            for (const trackInQueuedPlaylist of QcsPlaylistMap(queuedPlaylist).values()) {
            
                reachableMedia.add(trackInQueuedPlaylist);
            
            }
        
        }

    }    

    for (const media of QcsPlaylistMap('recents').values()) {

        reachableMedia.add(media);

        for (const track of QcsPlaylistMap(media).values()) {
        
            reachableMedia.add(track);
        
        }

    }

    for (const key of [...qcsCollabMap.keys()]) {

        const match = key.match(/^media-([^-]+)/);

        if (match !== null) {
        
            const [, media] = match;

            if (!reachableMedia.has(media)) {

                qcsCollabMap.delete(key);
            
            }
        
        }

    }

    for (const key of [...qcsCollabMap.keys()]) {

        const match = key.match(/^media-[^-]+-playlists-([^-]+)/);

        if (match !== null) {
        
            const [, playlist] = match;

            if (!reachableMedia.has(playlist)) {

                qcsCollabMap.delete(key);

            }
        
        }

    }

})();

const tempOpsFile = FsPath.join(qsDataDir, 'tempCollabMapOps');

let newOpsFileContents = '';

for (const op of qcsCollabMap.ops.values()) {

    newOpsFileContents += JSON.stringify(op) + '\n';

}

fs.writeFileSync(tempOpsFile, newOpsFileContents);

fs.renameSync(tempOpsFile, opsFile);

const opsFileAppendStream = fs.createWriteStream(opsFile, {flags: 'a'});

qcsCollabMap.changeHandlers.push((change) => {

    opsFileAppendStream.write(JSON.stringify(change.op) + '\n');        

});
