import DefSubstringByCircumfix from './DefSubstringByCircumfix.js';

const YtInitialData = (html) => {

    return JSON.parse(DefSubstringByCircumfix(html, '">var ytInitialData = ', ';</script>'));

};

export default YtInitialData;
