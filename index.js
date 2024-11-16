const firstCardOffset = 0x1F0A1; // Ace of spades

const suitOffsets = {
    "spade": 0x0,
    "heart": 0x10,
    "diamond": 0x20,
    "club": 0x30
};

const cardValueOffsets = {
    "ace": 0, 
    "one": 0, 
    1: 0,
    "two": 1,
    2: 1,
    "three": 2,
    3: 2,
    "four": 3,
    4: 3,
    "five": 4,
    5: 4,
    "six": 5,
    6:5,
    "seven": 6,
    7: 6,
    "eight": 7,
    8: 7,
    "nine": 8, 
    9: 8,
    "ten": 9,
    10: 9,
    "jack": 10,
    "knight": 11,
    "queen": 12,
    "king": 13
}

const tarotIndividualOffset = 0x40;
const bourgeoisTarotOffsets = {
    "individual": 0,
    "childhood": 1,
    "youth": 2,
    "maturity": 3,
    "oldage": 4,
    "old age": 4,
    "morning": 5,
    "afternoon": 6,
    "evening": 7,
    "night": 8,
    "earth": 9,
    "air": 9,
    "water": 10,
    "fire": 10,
    "dance": 11,
    "shopping": 12,
    "openair": 13,
    "open air": 13,
    "visualarts": 14,
    "visual arts": 14,
    "spring": 15,
    "summer": 16,
    "autumn": 17,
    "fall": 17,
    "winter": 18,
    "thegame": 19,
    "the game": 19,
    "collective": 20
};

const cards = new Proxy({}, {
    get(_t, prop) {
        if (typeof prop === 'symbol') throw new TypeError('Symbol keys should not be used');
        //let result = /(ace|1|two|2|three|3|four|4|five|5|six|6|seven|7|eight|8|nine|9|ten|10|jack|knight|queen|king) (?:of )?(spade|heart|diamond|club)s?/i.exec(prop)// "ace of hearts" "ace heart" &
        let result = (new RegExp(`(${Object.keys(cardValueOffsets).join('|')}) ?(?:of ?)?(${Object.keys(suitOffsets).join('|')})s?`, 'i')).exec(prop.toLowerCase());
        if (result) {
            // @ts-ignore string values here are limited so this is fine
            return String.fromCodePoint(firstCardOffset + suitOffsets[result[2]] + cardValueOffsets[result[1]])
        }
        result = (new RegExp(`(${Object.keys(cardValueOffsets).join('|')})`, 'i')).exec(prop.toLowerCase());
        if (result) {
            return new Proxy({}, {
                get(_t, prop) {
                    if (prop.toLowerCase() === 'of') return new Proxy({}, {
                        get(_t, prop) {
                            return cards[`${result[1].toLowerCase()}${prop.toLowerCase()}`]
                        }
                    });
                    let r = (new RegExp(`(?:of ?)?(${Object.keys(suitOffsets).join('|')})s?`, 'i')).exec(prop.toLowerCase());
                    if (r) {
                        return cards[`${result[1]}${r[1]}`]
                    } else throw Error('subproxy fun')
                    //return cards[`${result[1]} ${prop}`] // redundant
                },
                set() { return false }
            })
        }
        throw new Error('Value isn\'t valid card');
    },
    set() { return false },
    ownKeys() {
        return Object.keys(suitOffsets)
            .flatMap(suit => Object.keys(cardValueOffsets)
                .map(value => `${value} of ${suit}s`))
    }
});

export { cards }