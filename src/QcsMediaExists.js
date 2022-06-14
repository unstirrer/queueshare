import qcsCollabMap from './qcsCollabMap.js';

const QcsMediaExists = (media) => {

    return media === 'queue' || media === 'recents' || qcsCollabMap.has(`media-${media}-info`);

};

export default QcsMediaExists;
