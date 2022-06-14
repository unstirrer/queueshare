import defBufferHttpResBody from './defBufferHttpResBody.js';
import HttpResAsJsonValue from './HttpResAsJsonValue.js';
import HttpsGetRes from './HttpsGetRes.js';
import Id from './Id.js';
import qsWriteDebuggingInfo from './qsWriteDebuggingInfo.js';
import ThroweeAsJsonValue from './ThroweeAsJsonValue.js';
import Ungzipped from './Ungzipped.js';
import YtInitialData from './YtInitialData.js';
import YtResultDuration from './YtResultDuration.js';
import YtRunsAsId from './YtRunsAsId.js';

const QsYtPlaylistVideoResults = async (playlist) => {

    let res, resBody;

    const results = [];

    let threw = false;

    let throwee;

    try {

        res = await HttpsGetRes(`https://www.youtube.com/watch?${new URLSearchParams({list: playlist})}`, {headers: {'Accept-Encoding': 'gzip'}});

        resBody = await defBufferHttpResBody(res);

        for (const {playlistPanelVideoRenderer} of YtInitialData((await Ungzipped(resBody)).toString()).contents.twoColumnWatchNextResults.playlist.playlist.contents) {

            if (playlistPanelVideoRenderer !== undefined) {

                results.push({kind: 'video', subtitle: YtRunsAsId(playlistPanelVideoRenderer.longBylineText.runs), title: Id(playlistPanelVideoRenderer.title.simpleText), value: {duration: playlistPanelVideoRenderer.lengthText === undefined? -1 : YtResultDuration(playlistPanelVideoRenderer.lengthText.simpleText), video: Id(playlistPanelVideoRenderer.videoId)}});
            
            }

        }

    } catch (caughtThrowee) {

        threw = true;

        throwee = caughtThrowee;

    }

    qsWriteDebuggingInfo('qsYtPlaylistVideoResultsInfo', {playlist, res: res === undefined? null : HttpResAsJsonValue(res), resBody: resBody === undefined? null : resBody.toString('base64'), threw, throwee: threw? ThroweeAsJsonValue(throwee) : null});

    return threw? null : results;

};

export default QsYtPlaylistVideoResults;
