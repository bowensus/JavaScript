import * as textFile from '../js2/text_ui.js';
import { Room } from '../js2/room.js';
import { Backpack } from '../js2/backpack.js';
import { Player } from '../js2/player.js';
import { Enemy } from '../js2/enemy.js';


class Game {
    constructor() {
        this.level = 1;
        this.createRooms();
        this.textUI = new textFile.TextUI();
        this.player = new Player();
        this.areaClean = false;
        this.searchTimes = 0;
        this.death = false;
        this.next = false;
    }

    createRooms() {
        this.outside = new Room("outside");
        this.lobby = new Room("lobby");
        this.corridor = new Room("corridor");
        this.lab = new Room("lab");
        this.office = new Room("office");
        // initial location
        this.current = this.outside;

        if (this.level === 1) {
            this.outside.setExits("east", this.lobby);
            this.outside.setExits("south", this.lab);
            this.outside.setExits("west", this.corridor);
            this.lobby.setExits("west", this.outside);
            this.corridor.setExits("east", this.outside);
            this.lab.setExits("north", this.outside);
            this.lab.setExits("east", this.office);
            this.office.setExits("west", this.lab);
        }
        if (this.level === 2) {
            this.office.setExits("east", this.lobby);
            this.lobby.setExits("south", this.outside);
            this.lobby.setExits("west", this.office);
            this.lobby.setExits("east", this.lab);
            this.outside.setExits("north", this.lobby);
            this.outside.setExits("east", this.corridor);
            this.lab.setExits("west", this.lobby);
            this.corridor.setExits("west", this.outside);
        }
        if (this.level === 3) {
            this.office.setExits("north", this.outside);
            this.corridor.setExits("south", this.outside);
            this.corridor.setExits("west", this.lab);
            this.corridor.setExits("east", this.lobby);
            this.outside.setExits("north", this.corridor);
            this.outside.setExits("south", this.office);
            this.lab.setExits("east", this.corridor);
            this.lobby.setExits("west", this.corridor);
        }
    }

    play() {
        let finish = false;
        this.printWelcome();
        while (!finish) {
            try {
                const command = this.textUI.getCommand();
                finish = this.processCommand(command);
            } catch (e) {
                console.log("Game Error: " + e);
                break;
            }
        }
        console.log("Thank you for playing!");
    }

    printWelcome() {
        this.textUI.printToTextUI("You are lost. You are alone. You wander.");
        this.textUI.printToTextUI("around the deserted complex.");
        this.textUI.printToTextUI("");
        this.textUI.printToTextUI(`Your command words are: ${this.showCommandWords()}`);
    }

    showCommandWords() {
        const commandWords = ["help", "go", "quit", "search", "fight", "check", "leave"];
        return commandWords;
    }

    printHelp() {
        this.textUI.printToTextUI(textFile.helpText);
    }

    processCommand(command) {

        let [firstCommandWord, secondCommandWord] = command;

        if (typeof firstCommandWord === "string") {
            firstCommandWord = firstCommandWord.toUpperCase();
        }

        let wantToQuit = false;

        if (firstCommandWord === "HELP") {
            this.printHelp();
        } else if (firstCommandWord === "GO") {
            this.doGoCommand(secondCommandWord);
        } else if (firstCommandWord === "SEARCH") {
            this.doSearchCommand();
        } else if (firstCommandWord === "CHECK") {
            this.doCheckCommand(secondCommandWord);
        } else if (firstCommandWord === "QUIT") {
            wantToQuit = true;
        } else {
            this.textUI.printToTextUI("Don't know what you want!");
        }

        if (this.death) {
            wantToQuit = true;
        }
        if (this.level === 3) {
            wantToQuit = true;
            this.textUI.printToTextUI("Congratulations!");
        }
        return wantToQuit;
    }

    doGoCommand(secondWordCommand) {

        if (!secondWordCommand) {
            this.textUI.printToTextUI("Where to go?");
            this.textUI.printToTextUI(this.current.getLongDescription());
        } else if (secondWordCommand === "next" && this.next && this.current.description == "corridor"){
            this.level += 1;
            this.createRooms();
            this.next = false;
        } else if (secondWordCommand === "next" && !this.next) {
            this.textUI.printToTextUI("You haven't search all rooms in current area.");
        } else if (secondWordCommand === "next" && this.current.description !== "corridor") {
            this.textUI.printToTextUI("You have to go to a corridor to move into next area.");
        } else {
            let nextRoom = this.current.getExit(secondWordCommand);
            if (!nextRoom) {
                this.textUI.printToTextUI("There is no door!");
            } else {
                this.current = nextRoom;
                this.textUI.printToTextUI(this.current.getLongDescription());
                if (this.current.description === "secret") {
                    this.textUI.printToTextUI("Congratulation! You find a secret room!");
                }
                if (this.current.description === "outside" || this.current.description === "corridor") {
                    this.current.clean = true;
                }
            }
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    doSearchCommand() {

        if (["outside", "corridor"].includes(this.current.description)) {
            this.current.clean = true;
        } else if (["lab", "lobby"].includes(this.current.description)) {
            this.searchTimes = 3;
        } else if (this.current.description === "office") {
            this.searchTimes = 4;
        }

        if (this.current.clean) {
            this.textUI.printToTextUI("There is nothing here.");
            return;
        }

        while (!this.current.clean && !this.death) {
            let diceRoll = this.getRandomInt(1, 10)

            if (this.current.description === "office") {
                if (diceRoll >= 5) {
                    this.textUI.printToTextUI("You meat a monster, start fighting...");
                    this.doFightCommand();
                    this.searchTimes -= 1;
                } else {
                    this.textUI.printToTextUI("You find a gold.");
                    this.searchTimes -= 1;
                }
            }

            if (this.current.description === "lab" || this.current.description === "lobby") {
                if (diceRoll >= 6) {
                    this.textUI.printToTextUI("You meat a monster, start fighting...");
                    this.doFightCommand();
                    this.searchTimes -= 1;
                } else {
                    this.textUI.printToTextUI("You find a gold.");
                    this.player.gold += 1;
                    this.searchTimes -= 1;
                }
            }

            if (this.searchTimes === 0 && !this.death) {
                this.textUI.printToTextUI("There is nothing here.");
                this.current.clean = true;
                break;
            }
        }
    }

    doCheckCommand(secondWordCommand) {

        if (!secondWordCommand) {
            this.textUI.printToTextUI("What do you want to check, info, bag, monster, or command?");
        }
        else if (secondWordCommand === "info") {
            this.textUI.printToTextUI(`hp: ${this.player.statue.hp}, atk: ${this.player.statue.atk}, def: ${this.player.statue.def}`);
        }
        else if (secondWordCommand === "bag") {
            this.textUI.printToTextUI("There are items in your backpack:");
            for (let i = 0; i < this.player.bag; i++) {
                this.textUI.printToTextUI(`${i + 1}: ${this.player.bag[i]}`);
            }
            this.textUI.printToTextUI("Would you like to use someone?");
        }
        else if (secondWordCommand === "monster") {
            let monster = new Enemy();
            monster.statue.hp = monster.statue.hp * 10 + this.level * 5;
            monster.statue.atk = monster.statue.atk * 10 + this.level * 3;
            monster.statue.def = monster.statue.def * 10 + this.level * 2;
            this.textUI.printToTextUI("The attributes of monsters in current area:");
            this.textUI.printToTextUI(`hp: ${monster.statue.hp}, atk: ${monster.statue.atk}, def: ${monster.statue.def}`)
        }
        else if (secondWordCommand === "command") {
            this.textUI.printToTextUI(this.showCommandWords());
        }
        else {
            this.textUI.printToTextUI("Don't know what you mean.")
        }
    }

    doFightCommand(secondWordCommand) {

        let monsters = new Enemy();
        monsters.statue.hp = monsters.statue.hp * 10 + this.level * 5;
        monsters.statue.atk = monsters.statue.atk * 10 + this.level * 3;
        monsters.statue.def = monsters.statue.def * 10 + this.level * 2;

        let atk = Math.max(0, this.player.statue.atk - monsters.statue.def);
        let hit = Math.max(monsters.statue.atk - this.player.statue.def);

        while (true) {

            monsters.statue.hp -= atk;
            this.textUI.printToTextUI(`> You dealt ${atk} point of damage to a monster.`);
            this.player.statue.hp -= hit;
            this.textUI.printToTextUI(`> You were bitten and took ${hit} point of damage.`);

            if (monsters.statue.hp <= 0) {
                this.textUI.printToTextUI("You defeated the monster, continue searching...");
                break;
            } else if (this.player.statue.hp <= 0) {
                this.textUI.printToTextUI("Sorry, you lost the game.");
                this.death = true;
                break;
            }
        }
    }

    doLeaveCommand() {
        this.searchTimes -= 1;
    }

}

const game = new Game();
game.createRooms();
game.play();



