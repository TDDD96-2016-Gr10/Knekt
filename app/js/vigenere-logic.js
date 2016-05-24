/**
 * @file Logic file for Vigenere tool
 * @author Victor Tranell <victr593@student.liu.se>
 * @author Erik Rönmark <eriro331@student.liu.se>
 * @author Rebecka Geijer Michaeli <rebge882@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 */

/**
 * Decrypt letter using caesar cipher.
 * @param {string} cryptoletter
 * @param {string} keyletter
 * @param {string} alphabet
 * @returns {string} decrypted letter
 */
var caesarLookUp = function(cryptoletter, keyletter, alphabet) {
    if (typeof cryptoletter !== "string" ||
        typeof keyletter !== "string" ||
        typeof alphabet !== "string"){
        throw new TypeError("Argument is not a string");
    } else if(cryptoletter === "" || keyletter === "" || alphabet === "") {
        throw new Error("Argument is empty string")
    }
    var cryptoletterIndex = alphabet.indexOf(cryptoletter);
    if (cryptoletterIndex === -1) {
        console.log("vig:Cryptoletter not in alphabet");
        return "?";
    }
    var i = alphabet.indexOf(keyletter);
    if (i === -1) {
        throw new Error("Key is not in the alphabet");
    }
    var j = alphabet.indexOf(cryptoletter, i);
    var index;
    if (j === -1) {
        index = alphabet.length-i + cryptoletterIndex;
    } else {
        index = j-i;
    }
    return alphabet[index];
};

/**
 * Do a reverse caesar lookup
 * @param cryptoletter
 * @param keyletter
 * @param alphabet
 * @returns {}
 *
 * TODO: check if it works
 */
var caesarReverseLookUp = function(cryptoletter, keyletter, alphabet) {
    var i = alphabet.indexOf(cryptoletter);
    var j = alphabet.indexOf(keyletter);
    return alphabet[(i+j) % alphabet.length];
};

/**
 * Dechiper text encrypted with vigenere.
 * @param {string} text
 * @param {string} key
 * @param {string} lang
 * @returns {string} decrypted text
 */
var decipherVigenereString = function(text, key, lang) {
    if(typeof text !== "string" ||
        typeof key !== "string" ||
        typeof lang !== "string"){
        throw new TypeError("Argument is not a string");
    }
    var keyLength = key.length;
    var textLength = text.length;
    var plaintext = "";
    var vigAlphabet = getAlphabet(lang);
    for(var i = 0; i < textLength; i++){
        plaintext += caesarLookUp(text[i], key[i % keyLength], vigAlphabet);
    }

    return plaintext;
};

/**
 * Encrypt text using vigenere
 * @param plaintext
 * @param key
 * @param vigAlphabet
 * @returns {string} encrypted text
 *
 * TODO: Check if it works
 */
var encryptVigenere = function(plaintext, key, vigAlphabet) {
    var keyIndex = 0;
    var keyLength = key.length;
    var textLength = plaintext.length;
    var encryptedText = "";

    for (var i = 0; i < textLength; i++) {
        encryptedText += caesarReverseLookUp(plaintext[i], key[keyIndex], vigAlphabet);
        keyIndex = (keyIndex + 1) % keyLength;
    }

    return encryptedText;
};

/**
 * Calculates shifted alphabet, used as data for drawing shiftable graph
 * @param offsetInKey Position in the key [0, keyLength-1]
 * @param keyLength
 * @param cryptoText
 * @param alphaObj
 * @returns {{name: string, data: Array}} shifted alphabet data
 */
var vigLetterGraph = function(offsetInKey, keyLength, cryptoText, alphaObj) {
    if (typeof offsetInKey !== "number" ||
            offsetInKey < 0 || offsetInKey >= keyLength) {
        throw Error("I cannot let you do that, Dave");
    } else if (!alphaObj || typeof alphaObj !== "object") {
        throw Error("alphaObj must be an object");
    }

    var txt = "";
    for (var i = offsetInKey; i < cryptoText.length; i = i + keyLength) {
        txt += cryptoText[i];
    }

    countLetterFrequency(txt, alphaObj);

    return {
        name:"Vigenere offset alphabet",
        data: getValuesFromObject(alphaObj)
    };
};

/**
 * Returns a new array shifted numSteps relative to arr
 * left-shift if positive, right-shift if negative
 *
 * @param arr array-like object
 * @param numSteps positive or negative number
 * @returns {Array}
 */
var shiftArray = function(arr, numSteps) {
    if (typeof numSteps !== "number" || typeof arr !== "object") {
        throw Error("shiftArray: invalid parameters");
    }

    var ret = [];

    for (var i = 0; i < arr.length; ++i) {
        var index = (i + numSteps + arr.length) % arr.length;
        ret.push(arr[index]);
    }

    return ret;
};
