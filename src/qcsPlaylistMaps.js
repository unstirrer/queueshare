import qcsCollabMap from './qcsCollabMap.js';

const qcsPlaylistMaps = new Map();

const handleNewInfo = (media, playlist, infoAsJson) => {

    let playlistMap = qcsPlaylistMaps.get(playlist);

    if (playlistMap === undefined) {

        playlistMap = new Map();

        qcsPlaylistMaps.set(playlist, playlistMap);

    }

    playlistMap.set(JSON.parse(infoAsJson).position, media);    

};

for (const [key, value] of qcsCollabMap) {

    const match = key.match(/^media-([^-]+)-playlists-([^-]+)-info$/);

    if (match !== null) {
    
        const [, media, playlist] = match;

        handleNewInfo(media, playlist, value);

    }    

}

qcsCollabMap.changeHandlers.push((change) => {

    const match = change.key.match(/^media-([^-]+)-playlists-([^-]+)-info$/);

    if (match !== null) {
    
        const [, media, playlist] = match;

        if (change.oldValue !== '') {

            const playlistMap = qcsPlaylistMaps.get(playlist);
        
            playlistMap.delete(JSON.parse(change.oldValue).position);

            if (playlistMap.size === 0) {
            
                qcsPlaylistMaps.delete(playlist);
            
            }
        
        }

        if (change.value !== '') {

            handleNewInfo(media, playlist, change.value);
        
        }

    }

});

export default qcsPlaylistMaps;
