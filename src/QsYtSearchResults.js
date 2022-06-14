import defBufferHttpResBody from './defBufferHttpResBody.js';
import HttpResAsJsonValue from './HttpResAsJsonValue.js';
import HttpsGetRes from './HttpsGetRes.js';
import Id from './Id.js';
import ParsedRelativeUri from './ParsedRelativeUri.js';
import qsWriteDebuggingInfo from './qsWriteDebuggingInfo.js';
import ThroweeAsJsonValue from './ThroweeAsJsonValue.js';
import Ungzipped from './Ungzipped.js';
import YtInitialData from './YtInitialData.js';
import YtResultDuration from './YtResultDuration.js';
import YtRunsAsId from './YtRunsAsId.js';

const QsYtSearchResults = async (query) => {

    let res, resBody;

    const results = [];

    let threw = false;

    let throwee;

    try {

        res = await HttpsGetRes(`https://www.youtube.com/results?${new URLSearchParams({search_query: query})}`, {headers: {'Accept-Encoding': 'gzip'}});

        resBody = await defBufferHttpResBody(res);

        const initialData = YtInitialData((await Ungzipped(resBody)).toString());

        const cardChannelsInResults = new Set();

        const cardPlaylistsInResults = new Set();

        if (initialData.contents.twoColumnSearchResultsRenderer.secondaryContents !== undefined) {
         
            for (const {universalWatchCardRenderer} of initialData.contents.twoColumnSearchResultsRenderer.secondaryContents.secondarySearchContainerRenderer.contents) {

                const {watchCardRichHeaderRenderer} = universalWatchCardRenderer.header;

                const {webCommandMetadata} = watchCardRichHeaderRenderer.titleNavigationEndpoint.commandMetadata;

                if (webCommandMetadata.webPageType === 'WEB_PAGE_TYPE_CHANNEL') {

                    const channel = Id(watchCardRichHeaderRenderer.titleNavigationEndpoint.browseEndpoint.browseId);

                    results.push({kind: 'channel', subtitle: '', title: Id(watchCardRichHeaderRenderer.title.simpleText), value: channel});

                    cardChannelsInResults.add(channel);
                
                }
                else if (webCommandMetadata.webPageType === 'WEB_PAGE_TYPE_PLAYLIST') {

                    const playlist = Id(ParsedRelativeUri(webCommandMetadata.url).searchParams.get('list'));

                    results.push({kind: 'playlist', subtitle: Id(watchCardRichHeaderRenderer.subtitle.simpleText), title: Id(watchCardRichHeaderRenderer.title.simpleText), value: playlist});

                    cardPlaylistsInResults.add(playlist);

                }

            }
                        
        }

        for (const {itemSectionRenderer} of initialData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents) {

            if (itemSectionRenderer !== undefined) {

                for (const item of itemSectionRenderer.contents) {

                    if (item.channelRenderer !== undefined) {

                        const channel = Id(item.channelRenderer.channelId);

                        if (!cardChannelsInResults.has(channel)) {

                            results.push({kind: 'channel', subtitle: '', title: Id(item.channelRenderer.title.simpleText), value: channel});    
                        
                        }

                    }
                    else if (item.playlistRenderer !== undefined) {

                        const playlist = Id(item.playlistRenderer.playlistId);

                        if (!cardPlaylistsInResults.has(playlist)) {

                            results.push({kind: 'playlist', subtitle: YtRunsAsId(item.playlistRenderer.longBylineText.runs), title: Id(item.playlistRenderer.title.simpleText), value: playlist});
                        
                        }

                    }
                    else if (item.videoRenderer !== undefined) {

                        results.push({kind: 'video', subtitle: YtRunsAsId(item.videoRenderer.longBylineText.runs), title: YtRunsAsId(item.videoRenderer.title.runs), value: {duration: item.videoRenderer.lengthText === undefined? -1 : YtResultDuration(item.videoRenderer.lengthText.simpleText), video: Id(item.videoRenderer.videoId)}});

                    }
                
                }

            }

        }        

    } catch (caughtThrowee) {

        threw = true;

        throwee = caughtThrowee;

    }

    qsWriteDebuggingInfo('qsYtSearchResultsInfo', {query, res: res === undefined? null : HttpResAsJsonValue(res), resBody: resBody === undefined? null : resBody.toString('base64'), threw, throwee: threw? ThroweeAsJsonValue(throwee) : null});

    return threw? null : results;

};

export default QsYtSearchResults;
