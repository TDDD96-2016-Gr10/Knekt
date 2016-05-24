/**
 * @file Contains the logic used in the transposition tool.
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 */

/**
 * Takes an integer n and an element elem and returns a list containing n
 * instances of the element.
 * @param elem the element to fill the list with
 * @param n the number of strings
 * @returns {Array} a list of n elem elements
 */
function buildList(elem, n) {
    var res = [];
    for (var i = 0; i < n; i++) {
        res.push(elem);
    }
    return res;
}

/**
 * Takes a number of columns and a text and returns a list of columns generated
 * from the text.
 * @param {int} nCols the number of columns
 * @param {string} text the text
 * @returns {Array} a list of columns
 * @exception TypeError if text is not a string or nCols is not a number
 * @exception RangeError if nCols < 1
 */
function calculateColumns(nCols, text) {
    if (typeof text !== 'string') {
        throw new TypeError('text not a string');
    } else if (typeof nCols !== 'number') {
        throw new TypeError('nCols not a number');
    }
    if (nCols <= 0) {
        throw new RangeError("nCols smaller than 1");
    }

    var columns = buildList('', nCols);
    for (var i = 0; i < text.length; i++) {
        columns[i % nCols] += text[i];
    }
    return columns;
}

/**
 * Takes an encrypted text and some parameters, decrypts the text using the
 * parameters given, and returns the result.
 * @param {int} nCols the number of columns used
 * @param {Array} colPositions a list of the column positions
 * @param {string} encrText the encrypted text
 * @returns {string} a decrypted version of encrText
 * @exception RangeError bubbbling from calculateColumns if nCols < 1
 * @exception TypeError bubbling from calculateColumns if encrText is not a
 * string or nCols is not a number
 */
function decryptTransposition(nCols, colPositions, encrText) {
    var columns = calculateColumns(nCols, encrText);
    var result = '';
    // col and letter declared here since Javascript does not have block scope
    // Declarations made here to clarify the actual scope of the variables
    var col = 0;
    var letter = '';
    // Add nCols to length to catch eventual letters at the bottom of columns
    // that contain more letters than the others
    for (var i = 0; i < encrText.length + nCols; i++) {
        col = colPositions[i % nCols];
        letter = columns[col][Math.floor(i / nCols)];
        // Check for undefined since texts don't always
        // give columns of equal height
        result += letter ? letter : '';
    }
    return result;
}

/**
 * Takes a number and a string and pads the string with whitespace at the end
 * to make the length of the string evenly divisible by the number.
 * @param num the number
 * @param text the string
 */
function padText(num, text) {
    var paddedText = text;
    if (text.length % num !== 0) {
        for (var i = 0; i < num - (text.length % num); i++) {
            paddedText += ' ';
        }
    }
    return paddedText;
}

/**
 * Returns an object suitable to pass as context to the handlebars template used
 * to generate the GUI columns.
 * @param nCols the number of columns
 * @param encrText the encrypted text
 * @returns {{column: Array}} the object
 */
function getHandlebarsColumns(nCols, encrText) {
    var result = {column: []};
    var columns = calculateColumns(nCols, encrText);
    for (var i = 0; i < nCols; i++) {
        result.column.push({number: i + 1, letters: columns[i].split('')});
    }
    return result;
}

