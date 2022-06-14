const IsId = (value) => {

    return typeof value === 'string' && value !== '' && value.length <= 1000;

};

export default IsId;
