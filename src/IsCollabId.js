const IsCollabId = (value) => {

    return typeof value === 'string' && /^[0-9A-Z]{18}$/.test(value);

};

export default IsCollabId;
