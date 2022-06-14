import QcYtSearchQuery from './QcYtSearchQuery.js';

const qcYtSearchInput = document.createElement('input');

qcYtSearchInput.addEventListener('input', () => {

    QcYtSearchQuery.set(qcYtSearchInput.value);

});

qcYtSearchInput.type = 'search';

const updateValue = () => {

    qcYtSearchInput.value = QcYtSearchQuery();

};

updateValue();

QcYtSearchQuery.changeHandlers.push(updateValue);

export default qcYtSearchInput;

queueMicrotask(() => {

    qcYtSearchInput.focus();

});
