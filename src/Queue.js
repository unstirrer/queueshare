const Queue = class {

    constructor () {

        this.firstNode = undefined;

        this.lastNode = undefined;

    }

    append (value) {

        const node = {nextNode: undefined, value};

        if (this.lastNode === undefined) {

            this.firstNode = node;

        }
        else {

            this.lastNode.nextNode = node;

        }

        this.lastNode = node;

    }

    deleteFirstValue () {

        this.firstNode = this.firstNode.nextNode;

        if (this.firstNode === undefined) {

            this.lastNode = undefined;
            
        }

    }

    firstValue () {

        return this.firstNode.value;

    }

    isEmpty () {

        return this.firstNode === undefined;

    }

};

export default Queue;
