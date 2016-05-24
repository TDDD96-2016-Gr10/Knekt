/**
 * @file Handy stuff for the substitution tool.
 * @module substitution-logic
 * @author Kimberley French <kimfr230@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 */


/**
 * Constructs an alphabet object like {"A":"_", ...} for the provided param
 * @param {String} lang 2-letter code for the language
 * @exception Error when Array.prototype.reduce doesn't exist
 */
function initAlphabet(lang) {
    if (!Array.prototype.reduce) {
        throw Error("Browser does not have array.reduce");
    }

    var chosenLang = getAlphabet(lang).toUpperCase();

    return chosenLang.split("").reduce(function(obj, letter) {
        obj[letter] = "_";
        return obj;
    }, {});
}

/**
 * Creates a new string based on @param line, using the substitution alphabet
 * provided in @param alphabet
 * @param {String} line Representing a cryptotext to be substituted
 * @param {Object} alphabet Substitution object
 * @see initAlphabet
 * @exception Error when alphabet is not an object
 * @exception Error when line.length or line.charAt is undefined
 */
function decryptLine(line, alphabet) {
    if (typeof alphabet !== "object") {
        throw Error("cannot decrypt without a substitution alphabet object");
    } else if (typeof line.length == "undefined" ||
            typeof line.charAt != "function") {
        throw Error("cannot decrypt lines that does not have a length or index");
    }

    var text = "";
    for (var pos = 0, len = line.length; pos < len; pos++) {
        var plainChar = line.charAt(pos);
        var replChar = alphabet[plainChar];
        text += replChar || "_";
    }
    return text;
}

/**
 * Counts the number of keys in @param obj
 * @param {Object} obj generic object
 */
function objectSize(obj) {
    var sz = 0;

    if (typeof obj !== "object") {
        throw Error("objectSize does not like non-objects as parameters");
    }

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            ++sz;
        }
    }

    return sz;
}

/**
 * Constructs an object like {"A":2 ...} where the value for each key is the
 * number of occurrences of the key in @param arr
 * @param {Object} arr Plain array
 * @exception Error when @param is falsey or @param.length is undefined
 */
function getDuplicates(arr) {
    if (!arr || typeof arr.length == "undefined") {
        throw Error("Array must have a defined length");
    }
    var count = {};

    /* count occurrences of each letter, ignore empty strings */
    for (var i = 0, len = arr.length; i < len; ++i) {
        var ltr = arr[i];
        if (ltr) {
            if (count[ltr]) { /* seen before */
                count[ltr] += 1;
            } else { /* not seen before */
                count[ltr] = 1;
            }
        }
    }

    var dupes = {};
    /* takes only the ones with more than 1 occurrence, that is dupes */
    for (var key in count) {
        if (count.hasOwnProperty(key)) {
            if (count[key] > 1) {
                dupes[key] = count[key];
            }
        }
    }
    return dupes;
}

/**
 * Returns a regex object matching the provided 2-letter language code
 * @param {String} lang 2-letter code for the language
 * @exception Error when the language isn't recognized
 */
function getRegexForLang(lang) {
    /* Regexes used to detect valid input chars for the crypto alphabet */
    var EN_INPUT_REGEX_MASK = /^[a-z]+$/i;
    var SV_INPUT_REGEX_MASK = /^[a-zåäö]+$/i;

    if (lang === "sv") {
        return SV_INPUT_REGEX_MASK;
    } else if (lang === "en") {
        return EN_INPUT_REGEX_MASK;
    } else {
        throw Error("Lang not 'en' or 'sv'");
    }
}

/**
 * Takes an object and inverts its (key, value)-pairs, effectively making
 * the original value be a key to it's original key.
 * @param obj
 * @returns {{}}
 */
function invertObject(obj) {
    if (typeof obj !== "object") {
        throw Error("can't invert non-objects");
    }
    var out = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            out[obj[key]] = key;
        }
    }
    return out;
}

/**
 * returns an array containing the innerHTML of each element in the
 * collection
 * @returns {Array}
 * @exception bubbles
 */
jQuery.fn.toInnerHTMLArray = function() {
    var out = [];
    this.each(function(_, ele) {
        out.push(ele.innerHTML.trim(""));
    });
    return out;
};

/**
 * test if the html() of the collection results in empty string after
 * being trimmed
 * @returns {boolean}
 */
jQuery.fn.isEmpty = function() {
    return jQuery.trim(this.html()) == "";
};
