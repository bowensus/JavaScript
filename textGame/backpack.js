export class Backpack {
    constructor(capacity) {
        this.contents = [];
        this.capacity = capacity;
    }

    addItem(item) {
        if (this.contents.length < this.capacity) {
            this.contents.push(item);
            return true;
        }
        return false;
    }

    removeItem(item) {
        try {
            if (!this.contents.includes(item)) {
                throw new NotInBackpackError(item, "is not in the backpack.");
            }
        } catch (error) {
            if (error instanceof NotInBackpackError) {
                console.error(`${error.item} ${error.message}`);
            } else {
                this.contents.splice(index, 1);
            }
        } finally {
            console.log("Carrying on");
        }
    }

    checkItem(item) {
        return this.contents.includes(item);
    }
}

class NotInBackpackError extends Error {
    constructor(item, message) {
        super(message);
        this.item = item;
        this.name = "NotInBackpackError";
    }
}