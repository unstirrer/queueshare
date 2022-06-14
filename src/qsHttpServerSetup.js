import bufferHttpServerReqBody from './bufferHttpServerReqBody.js';
import FdStats from './FdStats.js';
import fs from 'node:fs';
import FsPath from 'node:path';
import FsPathExists from './FsPathExists.js';
import Gzipped from './Gzipped.js';
import httpServeFile from './httpServeFile.js';
import HttpServerReqAsJsonValue from './HttpServerReqAsJsonValue.js';
import IsCollabId from './IsCollabId.js';
import ParsedRelativeUri from './ParsedRelativeUri.js';
import qsHttpServer from './qsHttpServer.js';
import qsPackage from './qsPackage.cjs';
import qsQcCss from './qsQcCss.js';
import qsQcCssHash from './qsQcCssHash.js';
import QsQcHtml from './QsQcHtml.js';
import qsQcSetupJs from './qsQcSetupJs.js';
import qsQcSetupJsHash from './qsQcSetupJsHash.js';
import qsQcWsServer from './qsQcWsServer.js';
import QsRemoteQcUri from './QsRemoteQcUri.js';
import QsTrackAudioFileInfo from './QsTrackAudioFileInfo.js';
import qsTrackAudioFilesDir from './qsTrackAudioFilesDir.js';
import qsWriteDebuggingInfo from './qsWriteDebuggingInfo.js';
import QsYtAudioUri from './QsYtAudioUri.js';
import QsYtChannelResults from './QsYtChannelResults.js';
import QsYtPlaylistVideoResults from './QsYtPlaylistVideoResults.js';
import QsYtSearchResults from './QsYtSearchResults.js';
import QsYtVideoRelatedResults from './QsYtVideoRelatedResults.js';
import UndefReadFd from './UndefReadFd.js';

import './qsHttpServerListen.js';

const qcCssPathname = `/qcCss/${qsQcCssHash}`;

const qcSetupJsPathname = `/qcSetups/${qsQcSetupJsHash}`;

const [gzippedQcCss, gzippedQcSetupJs] = await Promise.all([Gzipped(qsQcCss), Gzipped(qsQcSetupJs)]);

const IsTrackAudioFileName = IsCollabId;

qsHttpServer.removeAllListeners('request').on('request', async (req, res) => {

    const {pathname, searchParams} = ParsedRelativeUri(req.url);

    if (pathname === '/') {

        if (req.method === 'GET') {

            res.writeHead(200, {'Content-Encoding': 'gzip', 'Content-Type': 'text/html; charset=utf-8'}).end(await Gzipped(QsQcHtml()));
                
        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }

    }
    else if (pathname === '/qcAppleTouchIcon') {

        if (req.method === 'GET') {

            res.writeHead(200, {'Content-Type': 'image/png'});

            httpServeFile(fs.createReadStream(FsPath.join(qsPackage, 'src', 'qcAppleTouchIcon.png')), res);
                
        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }
    
    }
    else if (pathname === qcCssPathname) {

        if (req.method === 'GET') {

            res.writeHead(200, {'Cache-Control': 'public, max-age=30240000, immutable', 'Content-Encoding': 'gzip', 'Content-Type': 'text/css; charset=utf-8'}).end(gzippedQcCss);
                
        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }
    
    }
    else if (pathname === '/qcFavicon') {

        if (req.method === 'GET') {
        
            res.writeHead(200, {'Content-Type': 'image/png'});

            httpServeFile(fs.createReadStream(FsPath.join(qsPackage, 'src', 'qcFavicon.png')), res);
                
        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }

    }
    else if (pathname === qcSetupJsPathname) {

        if (req.method === 'GET') {

            res.writeHead(200, {'Cache-Control': 'public, max-age=30240000, immutable', 'Content-Encoding': 'gzip', 'Content-Type': 'text/javascript'}).end(gzippedQcSetupJs);
                
        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }

    }
    else if (pathname === '/remoteQcUri') {

        if (req.method === 'GET') {

            res.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify(QsRemoteQcUri()));

        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }
    
    }
    else if (pathname === '/trackAudioFromFile') {

        if (req.method === 'GET') {

            if (IsTrackAudioFileName(searchParams.get('name'))) {
            
                const fd = await UndefReadFd(FsPath.join(qsTrackAudioFilesDir, searchParams.get('name')));

                if (fd === -1) {
                
                    res.writeHead(500).end();
                
                }
                else {

                    if (req.headers['range'] === undefined) {
                    
                        res.writeHead(200, {'Content-Type': searchParams.get('mimeType')});

                        httpServeFile(fs.createReadStream('', {fd}), res);                        
                    
                    }
                    else {
                    
                        const rangeMatch = req.headers['range'].match(/^bytes=(\d{1,15})-$/);

                        if (rangeMatch === null) {

                            res.writeHead(200, {'Content-Type': searchParams.get('mimeType')});

                            httpServeFile(fs.createReadStream('', {fd}), res);
                        
                        }
                        else {

                            const [, startString] = rangeMatch;

                            const start = Number(startString);

                            const {size} = await FdStats(fd);
                        
                            if (start < size) {

                                res.writeHead(206, {'Content-Length': String(size - start), 'Content-Range': `bytes ${start}-${size-1}/${size}`, 'Content-Type': searchParams.get('mimeType')});

                                httpServeFile(fs.createReadStream('', {fd, start}), res);
                            
                            }
                            else {

                                res.writeHead(200, {'Content-Type': searchParams.get('mimeType')});

                                httpServeFile(fs.createReadStream('', {fd}), res);      
                            
                            }
                        
                        }                        
                    
                    }
                
                }
            
            }
            else {
            
                res.writeHead(500).end();
            
            }

        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }
    
    }
    else if (pathname === '/writeDebuggingInfo') {
    
        if (req.method === 'POST') {

            const body = await bufferHttpServerReqBody(req);

            qsWriteDebuggingInfo('qsHttpServerWriteDebuggingInfoReqBody', body === undefined? null : body.toString('base64'));

            res.writeHead(204).end();

        }
        else {
        
            res.writeHead(405, {'Allow': 'POST'}).end();    
        
        }
    
    }
    else if (pathname === '/ytChannelResults') {
        
        if (req.method === 'GET') {

            res.writeHead(200, {'Content-Encoding': 'gzip', 'Content-Type': 'application/json'}).end(await Gzipped(JSON.stringify(await QsYtChannelResults(searchParams.get('channel'), searchParams.get('channelTitle')))));

        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }        
    
    }
    else if (pathname === '/ytPlaylistVideoResults') {
    
        if (req.method === 'GET') {

            res.writeHead(200, {'Content-Encoding': 'gzip', 'Content-Type': 'application/json'}).end(await Gzipped(JSON.stringify(await QsYtPlaylistVideoResults(searchParams.get('playlist')))));

        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }        
    
    }
    else if (pathname === '/ytSearchResults') {
    
        if (req.method === 'GET') {

            res.writeHead(200, {'Content-Encoding': 'gzip', 'Content-Type': 'application/json'}).end(await Gzipped(JSON.stringify(await QsYtSearchResults(searchParams.get('query')))));

        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }
    
    }
    else if (pathname === '/ytVideoRelatedResults') {
        
        if (req.method === 'GET') {

            res.writeHead(200, {'Content-Encoding': 'gzip', 'Content-Type': 'application/json'}).end(await Gzipped(JSON.stringify(await QsYtVideoRelatedResults(searchParams.get('video')))));

        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }
    
    }
    else if (pathname === '/ytVideoTrackAudio') {

        if (req.method === 'GET') {

            const fileInfo = QsTrackAudioFileInfo(searchParams.get('track'));

            if (IsTrackAudioFileName(fileInfo.name) && await FsPathExists(FsPath.join(qsTrackAudioFilesDir, fileInfo.name))) {
    
                res.writeHead(307, {'Location': `/trackAudioFromFile?${new URLSearchParams({mimeType: fileInfo.mimeType, name: fileInfo.name})}`}).end();
            
            }
            else {

                const uri = await QsYtAudioUri(searchParams.get('video'));

                if (uri === '') {
                
                    res.writeHead(500).end();
                
                }
                else {
                
                    res.writeHead(307, {'Location': uri}).end();
                
                }
            
            }

        }
        else {
        
            res.writeHead(405, {'Allow': 'GET'}).end();

        }
    
    }
    else {
    
        res.writeHead(404).end();        
    
    }

    qsWriteDebuggingInfo('qsHttpServerReq', HttpServerReqAsJsonValue(req));

});

qsHttpServer.on('upgrade', (req, socket, head) => {

    const {pathname} = ParsedRelativeUri(req.url);

    if (pathname === '/qcWs') {

        if (req.method === 'GET') {

            qsQcWsServer.handleUpgrade(req, socket, head, (ws) => {

                qsQcWsServer.emit('connection', ws, req);

            });        
                
        }
        else {
        
            socket.destroy();

        }

    }
    else {
    
        socket.destroy();
    
    }

    qsWriteDebuggingInfo('qsHttpServerUpgradeReq', HttpServerReqAsJsonValue(req));

});
