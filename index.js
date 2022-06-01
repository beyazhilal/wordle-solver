const fs = require('fs');
const prompt = require('prompt-sync')();

const numberOfLetters = Number(process.argv[2]) || 5;
const startWith = process.argv[3];
const tries = process.argv[4] || 6;

let wordsList = fs
  .readFileSync('./words/valid.txt', 'utf8')
  .split("\n")
  .filter(w => w.length === numberOfLetters);

let exclude = '';
const wrongPositions = [];
const correctLetters = [];
const letterCounts = {}; // only used for single letters really

const filter = () => {
  return wordsList.filter((word) => {
    const lettersList = word.split('');

    return !(new RegExp(`[${exclude}]`).test(word)) &&
    correctLetters.concat(wrongPositions).every(l => word.indexOf(l) >= 0) &&
    lettersList.every(
      (letter, position) => {
        if (letterCounts[letter] && word.split(letter).length-1 > letterCounts[letter]) return false;
        return wrongPositions[position] !== letter && (correctLetters[position] === letter || !correctLetters[position])
      }
    )
  });
}


let guess;

for (let i=0; i<tries; i++) {
  guess = i===0 && startWith || wordsList[0];
  if (i>=4 || wordsList.length <= 25) {
    console.log('Remaining words:');
    console.dir(wordsList);
  }

  const input = prompt(`Is it "${guess}"? `);

  // This is when guess is an invalid word
  if (input.toLowerCase() === 'skip') {
    i--;
    wordsList.shift();
    guess = wordsList[0];
    continue;
  }

  for (const [i, response] of Object.entries(input)) {
    if (response == 0 && exclude.indexOf(guess[i]) === -1) {
      exclude += guess[i];
    } else if (response == 1) {
      correctLetters[i] = guess[i];
    } else if (response == 2) {
      wrongPositions[i] = guess[i];
    }
  }

  // remove any existing letters from exclusion - e.g. didst for midst
  // we will only know 'd' exists after checking miDst
  for (const [j, letter] of Object.entries(exclude)) {
    if (correctLetters.concat(wrongPositions).indexOf(letter) >= 0) {
      exclude = exclude.replace(letter, '');
      // if we already have in correctLetters or wrongPositions and end up in exclusion,
      // then there must only be one instance of this letter
      letterCounts[letter] = 1;
    }
  }


  if (input == '1'.repeat(numberOfLetters)) {
    console.log('FOUND IT!', guess);
    break;
  }
  
  wordsList = filter();
  if (wordsList.length === 0) {
    console.log("Sorry, cannot find that word!");
    break;
  }

  // skip first one as we've already guessed
  // this happens when filtering doesn't remove what we've already guessed
  if (guess == wordsList[0]) {
    guess = wordsList.shift();
  }
}