import { TextUI } from '../js2/text_ui.js';

export class Room {

    constructor(description) {
        this.description = description;
        this.exits = {west:null, north:null, east:null, south:null};
        this.clean = false;
    }

    setExits(direction, neighbour) {
        this.exits[direction] = neighbour;
    }

    getLongDescription() {
        let longDescription = "Location " + this.description + " Exits: ";
        let directions = Object.keys(this.exits);
        let room = Object.values(this.exits);
        for (let i = 0; i < directions.length; i++) {
            if (room[i] !== null) {
                longDescription += directions[i];
                longDescription += ": ";
                longDescription += room[i].description;
                longDescription += ' ';
            }
        }
        return longDescription;
    }

    getExits() {
        let allExits = Object.keys(this.exits);
        return allExits;
    }

    getExit(direction) {
        let directions = Object.keys(this.exits)
        if (directions.includes(direction)) {
            return this.exits[direction];
        } else {
            return null;
        }
    }
}

