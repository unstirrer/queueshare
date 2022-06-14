const EventedRef = (value) => {

    const ref = () => {
    
        return value;
    
    };

    ref.changeHandlers = [];

    ref.set = (newValue) => {
    
        const oldValue = value;
        
        value = newValue;

        const change = {oldValue, value};

        for (const handler of ref.changeHandlers) {
        
            handler(change);
        
        }

    };

    return ref;

};

export default EventedRef;
