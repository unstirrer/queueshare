import CollabId from './CollabId.js';
import fs from 'node:fs';
import FsPath from 'node:path';
import qcsCollabMap from './qcsCollabMap.js';
import QcsMediaInfo from './QcsMediaInfo.js';
import qsDataDir from './qsDataDir.js';
import QsSortedPlaylistMedia from './QsSortedPlaylistMedia.js';
import QsTrackAudioFileInfo from './QsTrackAudioFileInfo.js';
import QsYtAudioRes from './QsYtAudioRes.js';
import QsYtAudioUri from './QsYtAudioUri.js';
import sendHttpResBodyToFile from './sendHttpResBodyToFile.js';
import wait from './wait.js';

import './qsCollabMapSetup.js';

const qsTrackAudioFilesDir = FsPath.join(qsDataDir, 'trackAudioFiles');

await fs.promises.mkdir(qsTrackAudioFilesDir, {recursive: true});

const prioritizedTracksToArchive = await (async () => {

    const fileNames = (await fs.promises.readdir(qsTrackAudioFilesDir)).filter((childName) => {
    
        return !childName.startsWith('.');
    
    });

    const files = fileNames.map((fileName) => {
    
        return FsPath.join(qsTrackAudioFilesDir, fileName);
    
    });

    const fileTracks = new Map();

    for (const key of qcsCollabMap.keys()) {

        const match = key.match(/^media-([^-]+)-info$/);

        if (match !== null) {
        
            const [, media] = match;

            const fileName = QsTrackAudioFileInfo(media).name;

            if (fileName !== '') {

                fileTracks.set(FsPath.join(qsTrackAudioFilesDir, fileName), media);
            
            }

        }

    }

    for (const file of files) {

        if (!fileTracks.has(file)) {
        
            await fs.promises.rm(file);
        
        }

    }

    const IsArchivableTrack = (media) => {

        const info = QcsMediaInfo(media);

        return info.kind === 'ytVideo';

    };

    const archiveFileSizes = new Map();

    for (const file of files) {

        const track = fileTracks.get(file);

        if (track !== undefined && IsArchivableTrack(track)) {

            archiveFileSizes.set(file, (await fs.promises.stat(file)).size);
        
        }

    }

    let archiveSize = 0;

    for (const size of archiveFileSizes.values()) {

        archiveSize += size;

    }

    const storedArchiveSizeLimit = qcsCollabMap.get('media-recents-trackAudioArchiveSizeLimit');

    const archiveSizeLimit = storedArchiveSizeLimit === ''? 0 : Number(storedArchiveSizeLimit);

    const reverseArchivePrioritizedMediaSet = new Set();

    for (const media of QsSortedPlaylistMedia('recents')) {

        reverseArchivePrioritizedMediaSet.add(media);

        for (const track of QsSortedPlaylistMedia(media)) {
        
            reverseArchivePrioritizedMediaSet.add(track);
        
        }

    }

    const archivePrioritizedMedia = [...reverseArchivePrioritizedMediaSet];

    archivePrioritizedMedia.reverse();

    const mediaArchivePriorities = new Map();

    for (let i = 0; i < archivePrioritizedMedia.length; i++) {

        mediaArchivePriorities.set(archivePrioritizedMedia[i], i);    

    }

    const MediaArchivePriority = (media) => {

        const storedPriority = mediaArchivePriorities.get(media);

        return storedPriority === undefined? -1 : storedPriority;

    };

    const prioritizedArchiveFiles = [...archiveFileSizes.keys()].sort((a, b) => {

        return MediaArchivePriority(fileTracks.get(a)) - MediaArchivePriority(fileTracks.get(b));

    });

    for (const file of prioritizedArchiveFiles) {

        if (archiveSize <= archiveSizeLimit) {
        
            break;
        
        }

        await fs.promises.rm(file);

        archiveSize -= archiveFileSizes.get(file);

    }

    const fileNameSet = new Set(fileNames);

    return archiveSizeLimit === 0? [] : archivePrioritizedMedia.filter((media) => {
    
        return IsArchivableTrack(media) && !fileNameSet.has(QsTrackAudioFileInfo(media).name);
    
    });   

})();

(async () => {

    for (let i = prioritizedTracksToArchive.length-1; i >= 0; i--) {
    
        await wait(1000000);

        const info = QcsMediaInfo(prioritizedTracksToArchive[i]);

        if (info.kind === 'ytVideo') {

            const uri = await QsYtAudioUri(info.value.video);

            if (uri !== '') {

                const res = await QsYtAudioRes(uri);

                if (res !== undefined) {
                
                    const fileName = CollabId();

                    const fileWriteStream = fs.createWriteStream(FsPath.join(qsTrackAudioFilesDir, fileName));
                    
                    sendHttpResBodyToFile(res, fileWriteStream);

                    await new Promise((resolve, reject) => {
                    
                        fileWriteStream.on('close', resolve);
                    
                    });

                    if (fileWriteStream.writableFinished) {

                        qcsCollabMap.set(`media-${prioritizedTracksToArchive[i]}-audioFileInfo`, JSON.stringify({mimeType: res.headers['content-type'], name: fileName}));
                    
                    }
                
                }    
            
            }
                
        }

    }

})();

export default qsTrackAudioFilesDir;
