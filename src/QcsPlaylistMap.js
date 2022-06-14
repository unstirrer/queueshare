import qcsPlaylistMaps from './qcsPlaylistMaps.js';

const emptyMap = new Map();

const QcsPlaylistMap = (media) => {

    const storedPlaylistMap = qcsPlaylistMaps.get(media);

    return storedPlaylistMap === undefined? emptyMap : storedPlaylistMap;

};

export default QcsPlaylistMap;
