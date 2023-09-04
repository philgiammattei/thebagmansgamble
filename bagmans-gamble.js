const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let userHoops = 0;
let computerHoops = 0;
let userRings = 0;
let computerRings = 0;
let userBags = 0;
let computerBags = 0;

let total, availableUserNumbers, availableComputerNumbers;
let target = 65;

function processTurn(newTarget) {
    resolveInventory();

    if (doesUserWin() || doesComputerWin()) {
        rl.close();
    } else {
        newRound(newTarget);
    }
}

function resolveInventory() {
    if (userHoops == 3) {
        userHoops = 0;
        userRings++;
        console.log("You used 3 hoops to make a ring!");
    }

    if (computerHoops == 3) {
        computerHoops = 0;
        computerRings++;
        console.log("Opponent used 3 hoops to make a ring!");
    }

    if (userRings == 5) {
        userRings = 0;
        userBags++;
        console.log("You used 5 rings to make a bag!");
    }

    if (computerRings == 5) {
        computerRings = 0;
        computerBags++;
        console.log("Opponent used 5 rings to make a bag!")
    }
}

function logUserInventory() {
    console.log(`You have ${userRings > 0 ? userRings + " ring" + (userRings > 1 ? "s" : "") + " and " : ""}${userHoops > 0 ? userHoops + " hoop" + (userHoops > 1 ? "s" : "") : "no hoops"}.`);
}

function logComputerInventory() {
    console.log(`Opponent has ${computerRings > 0 ? computerRings + " ring" + (computerRings > 1 ? "s" : "") + " and " : ""}${computerHoops > 0 ? computerHoops + " hoop" + (computerHoops > 1 ? "s" : "") : "no hoops"}.`);
}

function newRound(newTarget) {
    target = newTarget;

    total = 0;
    availableUserNumbers = [3, 4, 5, 6, 7, 8, 9];
    availableComputerNumbers = [3, 4, 5, 6, 7, 8, 9];

    logUserInventory();
    logComputerInventory();
    console.log(`A new battle has begun! Your target is ${target}.\n\n`);
    userTurn();
}

function doesUserWin() {
    if (userBags === 1) {
        console.log("You have a bag! You are become the Bagman!  TITHINGS TO THE BAGMAN.");
        return true;
    } else {
        return false;
    }
}

function doesComputerWin() {
    if (computerBags === 1) {
        console.log("Opponent has a bag! They are become the Bagman!  TITHINGS TO THE BAGMAN.");
        return true;
    } else {
        return false;
    }
}

function computerTurn() {
    const pick = availableComputerNumbers[Math.floor(Math.random() * availableComputerNumbers.length)];
    console.log(`Opponent battles with ${pick}.`);

    availableComputerNumbers = availableComputerNumbers.filter((num) => num !== pick);
    total += pick;
    console.log(`Total: ${total}.\n`);

    if (total > target) {
        console.log(`You win a hoop! Opponent pushed the total over ${target} to ${total}.`);
        userHoops++;
        processTurn(total - 5);
    } else {
        userTurn();
    }
}

function userTurn() {
    rl.question(`Battle! Available numbers are ${availableUserNumbers.map(number => " " + number)}:  `, (answer) => {
        const pick = parseInt(answer, 10);

        if (isNaN(pick) || !availableUserNumbers.includes(pick)) {
            console.log("YOU HAVE BATTLED WITH AN INCORRECT NUMBER.  BATTLE BETTER.");
            userTurn();
            return;
        }

        availableUserNumbers = availableUserNumbers.filter((num) => num !== pick);
        total += pick;
        console.log(`Total: ${total}.\n`);

        if (total > target) {
            console.log(`Opponent wins a hoop! You pushed the total over ${target} to ${total}.`);
            computerHoops++;
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
