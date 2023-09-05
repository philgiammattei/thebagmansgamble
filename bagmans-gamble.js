const { resolve } = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Player {
    constructor(isComputer = false) {
        this.hoops = 0;
        this.rings = 0;
        this.bags = 0;
        this.isComputer = isComputer;
        this.availableNumbers = [3, 4, 5, 6, 7, 8, 9];
    }

    logInventory() {
        console.log(`${this.isComputer ? 'Opponent has' : 'You have'} ${this.rings > 0 ? this.rings + " ring" + (this.rings > 1 ? "s" : "") + " and " : ""}${this.hoops > 0 ? this.hoops + " hoop" + (this.hoops > 1 ? "s" : "") : "no hoops"}.`);
    }

    resolveInventory() {
        if (this.hoops == 3) {
            this.hoops = 0;
            this.rings++;
            console.log(`${this.isComputer ? "Opponent" : "You"} used 3 hoops to make a ring!`);
        }

        if (this.rings == 5) {
            this.rings = 0;
            this.bags++;
            console.log(`${this.isComputer ? "Opponent" : "You"} used 5 rings to make a bag!`);
        }
    }

    removeNumber(pick) {
        this.availableNumbers = this.availableNumbers.filter((num) => num !== pick);
    }

    hasWon() {
        if (this.bags === 1) {
            console.log(`${this.isComputer ? "Opponent has" : "You have"} a bag! ${this.isComputer ? "They" : "You"} are become the Bagman! TITHINGS TO THE BAGMAN.`);
            return true;
        }
        return false;
    }

    resetAvailableNumbers() {
        this.availableNumbers = [3, 4, 5, 6, 7, 8, 9];
    }
}

let target = 65;
let total;

const user = new Player();
const computer = new Player(true);

function processTurn(newTarget) {
    bothPlayersDo(player => player.resolveInventory());
    bothPlayersDo(player => player.resetAvailableNumbers());

    if (user.hasWon() || computer.hasWon()) {
        rl.close();
    } else {
        newRound(newTarget);
    }
}

function bothPlayersDo(func) {
    func(user);
    func(computer);
}

function newRound(newTarget) {
    target = newTarget;
    total = 0;

    bothPlayersDo(player => player.logInventory());
    console.log(`A new battle has begun! Your target is ${target}.\n\n`);
    userTurn();
}

function computerTurn() {
    const pick = computer.availableNumbers[Math.floor(Math.random() * computer.availableNumbers.length)];
    console.log(`Opponent battles with ${pick}.`);

    computer.removeNumber(pick);
    total += pick;
    console.log(`Total: ${total}.\n`);

    if (total > target) {
        console.log(`You win a hoop! Opponent pushed the total over ${target} to ${total}.`);
        user.hoops++;
        processTurn(total - 5);
    } else {
        userTurn();
    }
}

function userTurn() {
    rl.question(`Battle! Available numbers are ${user.availableNumbers.map(number => " " + number)}:  `, (answer) => {
        const pick = parseInt(answer, 10);

        if (isNaN(pick) || !user.availableNumbers.includes(pick)) {
            console.log("YOU HAVE BATTLED WITH AN INCORRECT NUMBER. BATTLE BETTER.");
            userTurn();
            return;
        }

        user.removeNumber(pick);
        total += pick;
        console.log(`Total: ${total}.\n`);

        if (total > target) {
            console.log(`Opponent wins a hoop! You pushed the total over ${target} to ${total}.`);
            computer.hoops++;
            processTurn(total - 5);
        } else {
            computerTurn();
        }
    });
}

console.log("THE BAGMAN'S GAMBLE");
console.log("The goal is to become The Bagman.");
console.log("To become The Bagman, you must collect 5 rings.");
console.log("You can’t earn rings, but you can make them.");
console.log("Every 3 hoops is a ring.");
console.log("To earn hoops, you must number battle your opponent to create 5 less than the sum of the previous round using alternating numbers greater than 2 but less than 10.");
console.log("First round starts at 65.");
console.log("If you go over the number, your opponent gets a hoop.");
console.log("Once you have 5 rings, you can build a bag.");
console.log("First to build their bag is The Bagman.");
console.log("What makes it a gamble is that, every three turns, you can choose to wager hoops against your opponent or the house.");
console.log("If you lose against the house, you owe double the wager.");
console.log("If you go into -5 poverty, it’s game over and your opponent is The Bagman.\n\n");
newRound(target);
