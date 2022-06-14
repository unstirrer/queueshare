const scriptEl = document.getElementById('qcSetupArgScriptEl');

const qcSetupArg = JSON.parse(scriptEl.text);

scriptEl.remove();

export default qcSetupArg;
