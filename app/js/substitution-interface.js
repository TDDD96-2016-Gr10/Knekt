/**
 * @file Substitution interface builder.
 * @module substitution-interface
 * @author Kimberley French <kimfr230@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 */

/**
 * Creates the context for the draggable substitution-letters and
 * executes the handlebar script for that context.
 *
 * @param {Object} alphabet substitution alphabet
 * @see handlebarExec
 * @see initAlphabet
 */
function handlebarAlphabetDivs(alphabet) {
    if (typeof alphabet !== "object") {
        throw Error("alphabet must be an object");
    }

    var context = {
        letters: []
    };

    for (var key in alphabet) {
        if (alphabet.hasOwnProperty(key)) {
            context.letters.push(key.toUpperCase());
        }
    }

    handlebarExec("#orig-alphabet-hbs", "#plain-cryptobet .normal-alphabet", context);
    handlebarExec("#orig-alphabet-hbs", "#crypto-plainbet .normal-alphabet", context);
}

/**
 * Creates the context for the input-sensitive substitution-letters
 * and calls the handlebar executor for that context.
 *
 * @param {Object} alphabet substitution alphabet
 * @see handlebarExec
 * @see initAlphabet
 */
function handlebarCryptobetDivs(alphabet) {
    if (typeof alphabet !== "object") {
        throw Error("alphabet must be an object");
    }

    var context = {
        letters: []
    };

    for (var key in alphabet) {
        if (alphabet.hasOwnProperty(key)) {
            context.letters.push("");
        }
    }

    handlebarExec("#crypto-alphabet-hbs", "#crypto-alphabet", context);
    handlebarExec("#crypto-alphabet-hbs", "#plain-alphabet", context);
}

/**
 * Creates the context for the crypto and plaintext view, and places
 * the result of that handlebar execution in its designated selector
 *
 * @param {String} message the plaintext message
 * @param {Object} alphabet substitution alphabet
 * @see initAlphabet
 */
function handlebarMessageDivs(message, alphabet) {
    if (typeof message.length == "undefined" ||
            typeof message.substr == "undefined") {
        throw Error("a message needs a length");
    } else if (typeof alphabet !== "object") {
        throw Error("alphabet must be an object");
    }
    var rowLength = 60;
    var neededRows = Math.ceil(message.length / rowLength);

    var context = {
        row: []
    };
    for (var i = 0; i < neededRows; ++i) {
        var line = "PLACEHOLDER";
        if (message) {
            line = message.substr(rowLength * i, rowLength);
        }
        context.row.push({
            encrypted: line, decrypted: decryptLine(line, alphabet)
        });
    }

    handlebarExec("#message-divs-hbs", "#message-divs", context);
}
