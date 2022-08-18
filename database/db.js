const fs = require('fs');
const crypto = require('crypto');

class Database {


    constructor(path) {
        this.path = path;
        this.load();
        this.format = ["push", "pull", "other", "push", "pull"];
    }

    load() {
        const text = fs.readFileSync(this.path, { encoding: 'utf-8' });
        this.data = JSON.parse(text);
    }

    save() {
        const text = JSON.stringify(this.data);
        fs.writeFileSync(this.path, text, { encoding: 'utf-8' });
    }

    getWorkout() {
        let curr = this.data.profiles.emma.workout;
        let twelveHours = 12 * 60 * 60;
        if (Date.now() - curr.timestamp > twelveHours || !curr.timestamp) {
            let pushMoves = [...shuffle(this.data.movements.push)];
            let pullMoves = [...shuffle(this.data.movements.pull)];
            let newWorkout = {
                timestamp: Date.now(),
                movements: [
                    pushMoves.shift(),
                    pullMoves.shift(),
                    randomElement(this.data.movements.other),
                    pushMoves.shift(),
                    pullMoves.shift(),
                ]
            }
            this.data.profiles.emma.workout = newWorkout;
            this.save();

        }

        let movements = [];
        let i = 0;
        for (let movementType of this.format) {
            movements.push(
                {
                    ...this.data.profiles.emma[movementType][this.data.profiles.emma.workout.movements[i]],
                    title: this.data.profiles.emma.workout.movements[i],
                    type: movementType,
                    index: i
                }
            )
            i++;
        }

        return movements;
    }

    addMovement(input) {
        if (!input.title) {
            throw new Error("The movement must have a title");
        }
        this.data.movements[input.type].push(input.title);

        this.data.profiles.emma[input.type][input.title] = {
            setup: input.setup,
            PR: {
                reps: input.reps,
                weight: input.weight
            }
        };
        this.save();
    }

    updatePR(input) {
        let title = this.data.profiles.emma.workout.movements[input.index];
        console.log(title)
        this.data.profiles.emma[input.type][title] = {
            PR: {
                reps: input.reps,
                weight: input.weight
            }
        };
        this.save();
    }

}

function randomElement(arr) {
    let randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function shuffle(arr) {
    return arr.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

module.exports = { Database };