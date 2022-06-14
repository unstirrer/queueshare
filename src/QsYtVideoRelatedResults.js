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

const QsYtVideoRelatedResults = async (video) => {

    let res, resBody;

    const results = [];

    let threw = false;

    let throwee;

    try {

        res = await HttpsGetRes(`https://www.youtube.com/watch?${new URLSearchParams({v: video})}`, {headers: {'Accept-Encoding': 'gzip'}});

        resBody = await defBufferHttpResBody(res);

        for (const {compactVideoRenderer} of YtInitialData((await Ungzipped(resBody)).toString()).contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results) {
            
            if (compactVideoRenderer !== undefined) {

                results.push({kind: 'video', subtitle: YtRunsAsId(compactVideoRenderer.longBylineText.runs), title: Id(compactVideoRenderer.title.simpleText), value: {duration: compactVideoRenderer.lengthText === undefined? -1 : YtResultDuration(compactVideoRenderer.lengthText.simpleText), video: Id(compactVideoRenderer.videoId)}});

            }

        }

    } catch (caughtThrowee) {

        threw = true;

        throwee = caughtThrowee;

    }

    qsWriteDebuggingInfo('qsYtVideoRelatedResultsInfo', {res: res === undefined? null : HttpResAsJsonValue(res), resBody: resBody === undefined? null : resBody.toString('base64'), threw, throwee: threw? ThroweeAsJsonValue(throwee) : null, video});

    return threw? null : results;

};

export default QsYtVideoRelatedResults;
