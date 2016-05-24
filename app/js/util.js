/**
 * @file Contains useful non-logical (let's call them utility) functions.
 * @module util
 * @author Robert Kumpulainen <robku937@student.liu.se>
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 * @author Eric Henziger <erihe763@student.liu.se>
 * @author Victor Tranell <victr593@student.liu.se>
 */

/**
 * Memoizes the passed function, i.e any following calls to that function with
 * the same parameters will return the previous value without re-computation
 *
 * sample usage:
 * var factorial = memoize(function(i, j) {
 *   if (i < 0) {
 *     throw Error("some descriptive message");
 *   } else if (i <= 1) {
 *     return 1;
 *   } else {
 *     return i*factorial(i - 1, j);
 *   }
 * });
 *
 * thus:
 * 1) factorial(5, {}) will be a miss
 * 2) factorial(5, {1:0}) will be a miss
 * 3) factorial(5, {1:0}) will be a hit
 *
 * @param fn
 * @returns {Function}
 */
function memoize(fn) {
    var cache = {};

    var resolver = function(v) {
        /* >>> 0 makes it unsigned */
        return String(Hashcode.value(v) >>> 0);
    };

    return function() {
        /* arguments is to my understanding an array-like object,
         * thus the ordering criteria should be satisfied */
        var hash = resolver(JSON.stringify(arguments));
        
        return (cache[hash] = cache[hash] || fn.apply(this, arguments));
    }
}

/**
 * Return the values for each key in an object.
 * @param {object} dictionary An object with key/value pairs.
 * @returns {Array} An array with every value in the object.
 */
function getValuesFromObject(dictionary) {
    if (dictionary === null || typeof dictionary !== 'object'){
        throw new TypeError("Not an object!"); /* what is not an object? */
    }
    var values = [];
    for (var key in dictionary) {
        if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
            values.push(dictionary[key]);
        }
    }
    return values;
}

/**
 * @returns {string} alphabet for the provided language
 * @param {string} lang
 */
var getAlphabet = function(lang) {
    var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lang === "en") {
        return alpha;
    } else if (lang === "sv") {
        return alpha + "ÅÄÖ";
    } else if (typeof lang !== "string") {
        throw new TypeError("Argument is not a string");
    }

    throw Error("Language not recognized");
};

/**
 * matches textual names for keys (e.g backspace, tab, down) to keycodes and
 * attaches a keydown handler with @param callback
 * @param {String | Array} keys
 * @param {function} callback
 * @returns {*} Chainable jQuery
 */
jQuery.fn.keyboardEvents = function(keys, callback) {
    var KEY_CODES = {
        backspace:8, del:46, newline:13, tab:9,
        right:39, left:37, up:38, down:40
    };

    if (typeof callback !== "function") {
        throw Error("keyboardEvents expects callback to be a function")
    } else if (typeof keys.length !== "number") {
        throw Error("keyboardEvents expects keys to have a length property");
    }

    if (typeof keys === "string") {
        keys = keys.toLowerCase().split(" ");
    }

    var keyCodes = {};
    for (var i = 0; i < keys.length; ++i) {
        var keyCode = KEY_CODES[keys[i]];
        if (keyCode) {
            keyCodes[keyCode] = true;
        }
    }

    return this.on("keydown", function(e) {
        var that = e.currentTarget;
        if (e.keyCode in keyCodes) {
            jQuery.proxy(callback, that)();
            return false;
        }

        return true;
    });
};
