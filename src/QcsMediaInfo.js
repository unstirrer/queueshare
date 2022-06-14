import qcsCollabMap from './qcsCollabMap.js';

const QcsMediaInfo = (media) => {

    const storedInfo = qcsCollabMap.get(`media-${media}-info`);

    return storedInfo === ''? {kind: '', subtitle: '', title: '', value: null} : JSON.parse(storedInfo);

};

export default QcsMediaInfo;
