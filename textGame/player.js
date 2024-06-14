import {Backpack} from "./backpack.js";

export class Player {

    constructor() {
        this.bag = new Backpack(5);
        this.statue = {hp:200, atk:15, def:10};
        this.gold = 0;
    }
}