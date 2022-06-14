const CollabMap = class {

    constructor () {

        this.changeHandlers = [];

        this.localOps = new WeakSet();

        this.ops = new Map();

    }

    delete (key) {
    
        this.set(key, '');
    
    }

    get (key) {
    
        const op = this.ops.get(key);

        return op === undefined? '' : op.value;
    
    }

    has (key) {
    
        const op = this.ops.get(key);

        return op !== undefined && op.value !== '';
    
    }

    * keys () {
    
        for (const op of this.ops.values()) {
        
            if (op.value !== '') {
            
                yield op.key;
            
            }
        
        }
    
    }

    receive (op) {
    
        const existingOp = this.ops.get(op.key);

        if (existingOp === undefined || existingOp.version < op.version || (existingOp.version === op.version && existingOp.value < op.value)) {
        
            this.ops.set(op.key, op);

            const change = {key: op.key, oldValue: existingOp === undefined? '' : existingOp.value, op, value: op.value};

            for (const handler of this.changeHandlers) {
            
                handler(change);
            
            }

        }

    }

    set (key, value) {
    
        const existingOp = this.ops.get(key);

        const op = {key, value, version: existingOp === undefined? 0 : existingOp.version+1};

        this.localOps.add(op);

        this.ops.set(key, op);

        const change = {key, oldValue: existingOp === undefined? '' : existingOp.value, op, value};

        for (const handler of this.changeHandlers) {
        
            handler(change);
        
        }
    
    }

    * [Symbol.iterator] () {
    
        for (const op of this.ops.values()) {
        
            if (op.value !== '') {
            
                yield [op.key, op.value];
            
            }
        
        }
    
    }

};

export default CollabMap;
