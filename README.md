# Wordle-solver
Filter words step by step to solve Wordle and Wordle-like word games.

### Installation
After cloning the repo, run

```
npm install

# or with yarn
yarn install
```

### Usage
To run with default values of five letter words and six tries, start as
```
npm start
```

The script will start suggesting words step by step and filter as you go, until it either finds the correct word or runs out of tries.

For each guess you will be prompted to enter how close it is. Enter one of `0`, `1`, or `2` (without spaces) for each letter to indicate:

- `0`: Letter is NOT in the word
- `1`: Letter is in the word AND is in correct position (e.g. green in Wordle)
- `2`: Letter is in the word BUT is in the wrong position (e.g. orange in Wordle)

If an invalid word is suggested you can enter `skip` to go to the next guess. Skipping words will not penalise for attempt.

For example, if the script suggests **arise** and correct word is **brain**, you type in `21200`
- `a` exists in brain but is in a different position, hence `2`
- `r` exists and is in the correct position -> `1`
- `i` exists but in wrong position -> `2`
- `s` doesn't exist -> `0`
- ... so on


### Configuration
By default the script only suggests five-letter words, starting from first word found in the list of valid English words, and stops after six tries.

You can pass arguments to the `npm start` command to change these:
```
npm start -- <number_of_letters> <word_to_start_with> <number_of_tries>
```

For example
```
npm start -- 5 arise
```
will play for 5 letter words and start with "arise" as first suggestion.