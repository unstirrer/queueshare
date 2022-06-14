import defBufferHttpResBody from './defBufferHttpResBody.js';
import DefSubstringByCircumfix from './DefSubstringByCircumfix.js';
import HttpResAsJsonValue from './HttpResAsJsonValue.js';
import HttpsGetRes from './HttpsGetRes.js';
import qsWriteDebuggingInfo from './qsWriteDebuggingInfo.js';
import ThroweeAsJsonValue from './ThroweeAsJsonValue.js';
import Ungzipped from './Ungzipped.js';

let cachedPlayerJsUri = '';

let cachedSigFn, cachedNFn;

const QsYtAudioUri = async (video) => {

    let watchRes, watchResBody, playerJsRes, playerJsResBody;

    let uri = '';

    let threw = false;

    let throwee;

    try {

        watchRes = await HttpsGetRes(`https://www.youtube.com/watch?${new URLSearchParams({v: video})}`, {headers: {'Accept-Encoding': 'gzip'}});

        watchResBody = await defBufferHttpResBody(watchRes);

        const watchHtml = (await Ungzipped(watchResBody)).toString();

        const playerJsUri = 'https://www.youtube.com' + JSON.parse(DefSubstringByCircumfix(watchHtml, '">(function() {window.ytplayer={};\nytcfg.set(', '); window.ytcfg.obfuscatedData_ = [];var setMessage=functi')).PLAYER_JS_URL;

        let sigFn, nFn;

        if (playerJsUri === cachedPlayerJsUri) {
        
            sigFn = cachedSigFn;

            nFn = cachedNFn;

        }
        else {

            playerJsRes = await HttpsGetRes(playerJsUri);

            playerJsResBody = await defBufferHttpResBody(playerJsRes);

            const playerJs = playerJsResBody.toString();

            sigFn = (() => {
            
                const name = DefSubstringByCircumfix(playerJs, '(a,!0);a.set("alr","yes");c&&(c=', '(');

                const body = DefSubstringByCircumfix(playerJs, `;\n${name}=function(a){`, '};');

                const helperName = DefSubstringByCircumfix(body, 'a=a.split("");', '.');

                const helperBody = DefSubstringByCircumfix(playerJs, `;var ${helperName}={`, '};');

                return new Function('a', `var ${helperName}={${helperBody}};${body}`);
            
            })();

            nFn = (() => {
            
                const arrayName = DefSubstringByCircumfix(playerJs, '&&(b=a.get("n"))&&(b=', '[');

                const name = DefSubstringByCircumfix(playerJs, `;\nvar ${arrayName}=[`, ']');

                return new Function('a', DefSubstringByCircumfix(playerJs, `;\n${name}=function(a){`, '};'));
            
            })();

            cachedPlayerJsUri = playerJsUri;

            cachedSigFn = sigFn;

            cachedNFn = nFn;

        }

        const playerData = JSON.parse(DefSubstringByCircumfix(watchHtml, '">var ytInitialPlayerResponse = ', ';</script>'));

        const formats = [];

        if (playerData.streamingData.adaptiveFormats !== undefined) {
        
            formats.push(...playerData.streamingData.adaptiveFormats);
        
        }

        if (playerData.streamingData.formats !== undefined) {
        
            formats.push(...playerData.streamingData.formats);
        
        }

        let audioFormat;

        for (const itag of [251, 18]) {

            const formatWithItag = formats.find((format) => {
            
                return format.itag === itag;
            
            });

            if (formatWithItag !== undefined) {
            
                audioFormat = formatWithItag;

                break;
            
            }
        
        }

        let url;

        if (audioFormat.signatureCipher !== undefined) {

            const params = new URLSearchParams(audioFormat.signatureCipher);

            url = new URL(params.get('url'));

            url.searchParams.set('sig', sigFn(params.get('s')));
        
        }
        else if (audioFormat.url !== undefined) {

            url = new URL(audioFormat.url);

        }

        url.searchParams.set('n', nFn(url.searchParams.get('n')));

        uri = url.toString();

    } catch (caughtThrowee) {

        threw = true;
        
        throwee = caughtThrowee;

    }

    qsWriteDebuggingInfo('qsYtAudioUriInfo', {playerJsRes: playerJsRes === undefined? null : HttpResAsJsonValue(playerJsRes), playerJsResBody: playerJsResBody === undefined? null : playerJsResBody.toString('base64'), threw, throwee: threw? ThroweeAsJsonValue(throwee) : null, uri, video, watchRes: watchRes === undefined? null : HttpResAsJsonValue(watchRes), watchResBody: watchResBody === undefined? null : watchResBody.toString('base64')});

    return uri;

};

export default QsYtAudioUri;
