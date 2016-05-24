/**
 * @file Contains logic for the letter statistics charts.
 * @author Eric Henziger <erihe763@student.liu.se>
 * @author Erik Rönmark <eriro331@student.liu.se>
 */

/**
 * Count occurrences of each letter in a text.
 * @param {string} text An arbitrary string.
 * @param {object} alphabet
 * An object where the keys are the letters that we wish to count.
 * The value of the key will be set to the count of the letter.
 * It is assumed that the keys, the letters, are all upper case.
 * It is assumed that the value is initially set to zero.
 */
function countLetterFrequency(text, alphabet){
    if (typeof text !== 'string'){
        throw new TypeError("Not a string!")
    }
    if (alphabet === null || typeof alphabet !== 'object'){
        throw new TypeError("Not an object!");
    }
    var str = text.toUpperCase();
    for (var i = 0, len = str.length; i < len; i++) {
        if (str[i] in alphabet){ /* varför inte hasownproperty här? */
            alphabet[str[i]]++;
        }
    }
}

/**
 * Return an object with the frequency of Swedish letters in a text.
 * @param {string} text An arbitrary string.
 * @returns {object} dictionary An object with letter, frequency pairs.
 */
function getTextLetterFrequencySwe(text) {
    var dictionary ={
        'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0,
        'I': 0, 'J': 0, 'K': 0, 'L': 0, 'M': 0, 'N': 0, 'O': 0, 'P': 0, 'Q': 0,
        'R': 0, 'S': 0, 'T': 0, 'U': 0, 'V': 0, 'W': 0, 'X': 0, 'Y': 0, 'Z': 0,
        'Å': 0, 'Ä' : 0, 'Ö' : 0
    };
    if(text){
        countLetterFrequency(text, dictionary);
    }
    return dictionary;
}

/**
 * Return an object with the frequency of English letters in a text.
 * @param {string} text An arbitrary string.
 * @returns {object} dictionary An object with letter, frequency pairs.
 */
function getTextLetterFrequencyEng(text) {
    var dictionary = {
        'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0,
        'I': 0, 'J': 0, 'K': 0, 'L': 0, 'M': 0, 'N': 0, 'O': 0, 'P': 0, 'Q': 0,
        'R': 0, 'S': 0, 'T': 0, 'U': 0, 'V': 0, 'W': 0, 'X': 0, 'Y': 0, 'Z': 0
    };
    if(text){
        countLetterFrequency(text, dictionary);
    }
    return dictionary;
}
