import CollabPositionComparison from './CollabPositionComparison.js';
import QcsPlaylistMap from './QcsPlaylistMap.js';

const QsSortedPlaylistMedia = (media) => {

    const playlistMap = QcsPlaylistMap(media);

    return [...playlistMap.keys()].sort(CollabPositionComparison).map((position) => {

        return playlistMap.get(position);

    });

};

export default QsSortedPlaylistMedia;
