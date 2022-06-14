import qcsCollabMap from './qcsCollabMap.js';

const QsTrackAudioFileInfo = (media) => {

    const storedInfo = qcsCollabMap.get(`media-${media}-audioFileInfo`);

    return storedInfo === ''? {mimeType: '', name: ''} : JSON.parse(storedInfo);

};

export default QsTrackAudioFileInfo;
