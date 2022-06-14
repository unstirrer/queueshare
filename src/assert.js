const assert = (boolean) => {

    if (!boolean) {

        throw new Error('An assertion failed');

    }

};

export default assert;
