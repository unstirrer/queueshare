const ThroweeAsJsonValue = (throwee) => {

    try {

        return JSON.parse(JSON.stringify({message: throwee.message, name: throwee.name, stack: throwee.stack}));

    } catch (anotherThrowee) {
        
        return null;        
    
    }

};

export default ThroweeAsJsonValue;
