import defBufferHttpResBody from './defBufferHttpResBody.js';
import HttpResAsJsonValue from './HttpResAsJsonValue.js';
import HttpsGetRes from './HttpsGetRes.js';
import Id from './Id.js';
import ParsedRelativeUri from './ParsedRelativeUri.js';
import qsWriteDebuggingInfo from './qsWriteDebuggingInfo.js';
import ThroweeAsJsonValue from './ThroweeAsJsonValue.js';
import Ungzipped from './Ungzipped.js';
import YtInitialData from './YtInitialData.js';
import YtRunsAsId from './YtRunsAsId.js';

const QsYtChannelResults = async (channel, channelTitle) => {

    let res, resBody;

    const results = [];

    let threw = false;

    let throwee;

    try {

        res = await HttpsGetRes(`https://www.youtube.com/channel/${encodeURIComponent(channel)}/playlists`, {headers: {'Accept-Encoding': 'gzip'}});

        resBody = await defBufferHttpResBody(res);

        const initialData = YtInitialData((await Ungzipped(resBody)).toString());

        if (initialData.contents.twoColumnBrowseResultsRenderer.tabs.some(({tabRenderer}) => {
        
            return tabRenderer !== undefined && ParsedRelativeUri(tabRenderer.endpoint.commandMetadata.webCommandMetadata.url).pathname.split('/').pop() === 'videos';
        
        })) {
        
            results.push({kind: 'channelPopularVideos', title: 'Popular videos', subtitle: channelTitle, value: channel});

            results.push({kind: 'channelRecentVideos', title: 'Recent videos', subtitle: channelTitle, value: channel});

            results.push({kind: 'channelOldVideos', title: 'Old videos', subtitle: channelTitle, value: channel});
        
        }

        for (const {tabRenderer} of initialData.contents.twoColumnBrowseResultsRenderer.tabs) {

            if (tabRenderer !== undefined) {

                if (ParsedRelativeUri(tabRenderer.endpoint.commandMetadata.webCommandMetadata.url).pathname.split('/').pop() === 'playlists') {

                    const {sectionListRenderer} = tabRenderer.content;

                    for (const {itemSectionRenderer} of sectionListRenderer.contents) {

                        for (const item of itemSectionRenderer.contents) {

                            if (item.gridRenderer !== undefined) {

                                results.push({kind: 'list', subtitle: channelTitle, title: Id(sectionListRenderer.subMenu.channelSubMenuRenderer.contentTypeSubMenuItems.find((menuItem) => {
                                
                                    return menuItem.selected;
                                
                                }).title), value: item.gridRenderer.items.map(({gridPlaylistRenderer}) => {

                                    return {kind: 'playlist', subtitle: channelTitle, title: YtRunsAsId(gridPlaylistRenderer.title.runs), value: Id(gridPlaylistRenderer.playlistId)};                                        
                                
                                })});
                            
                            }
                            else if (item.shelfRenderer !== undefined) {

                                const {content} = item.shelfRenderer;

                                if (content.expandedShelfContentsRenderer !== undefined) {

                                    results.push({kind: 'list', subtitle: channelTitle, title: YtRunsAsId(item.shelfRenderer.title.runs), value: content.expandedShelfContentsRenderer.items.map(({playlistRenderer}) => {

                                        return {kind: 'playlist', subtitle: channelTitle, title: Id(playlistRenderer.title.simpleText), value: Id(playlistRenderer.playlistId)};
                                
                                    })});
                                
                                }
                                else if (content.horizontalListRenderer !== undefined) {

                                    results.push({kind: 'list', subtitle: channelTitle, title: YtRunsAsId(item.shelfRenderer.title.runs), value: content.horizontalListRenderer.items.map(({gridPlaylistRenderer}) => {
                                    
                                        return {kind: 'playlist', subtitle: channelTitle, title: YtRunsAsId(gridPlaylistRenderer.title.runs), value: Id(gridPlaylistRenderer.playlistId)};
                                    
                                    })});

                                }

                            }
                        
                        }
                    
                    }
                
                }
            
            }
        
        }

    } catch (caughtThrowee) {

        threw = true;

        throwee = caughtThrowee;

    }

    qsWriteDebuggingInfo('qsYtChannelResultsInfo', {channel, channelTitle, res: res === undefined? null : HttpResAsJsonValue(res), resBody: resBody === undefined? null : resBody.toString('base64'), threw, throwee: threw? ThroweeAsJsonValue(throwee) : null});

    return threw? null : results;

};

export default QsYtChannelResults;
