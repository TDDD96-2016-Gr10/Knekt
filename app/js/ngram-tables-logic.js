/**
 * @file Contains logic for calculating ngram occurrences.
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 */

/**
 * Takes a string text and a number n and returns the most common n-grams
 * of the text sorted in descending order. The number of n-grams returned is
 * specified by count. If less than count n-grams exist all of the n-grams are
 * returned.
 * @param text the string to be analyzed.
 * @param n the length of the n-grams.
 * @param count the number of n-grams to return
 * @returns {Array.<T>}
 * @exception TypeError if text not a string or n not a number
 * @exception RangeError if n < 1
 */
function getNGramCount(text, n, count) {
    if (typeof text !== 'string') {
        throw TypeError('text must be a string');
    } else if (typeof n !== 'number') {
        throw TypeError('n must be a number');
    } else if (n < 1) {
        throw RangeError('n must be greater than or equal to one');
    } else if (typeof count !== 'number') {
        throw TypeError('count must be a number');
    } else if (count < 0) {
        throw RangeError('count must be non-negative');
    }

    text = text.toUpperCase();

    var ngrams = {};
    var ng = '';
    for (var i = 0; i <= text.length - n; i++) {
        ng = text.slice(i, i + n);
        if (ngrams[ng]) {
            ngrams[ng] += 1;
        } else {
            ngrams[ng] = 1;
        }
    }

    var res = [];
    for (ng in ngrams) {
        if (ngrams.hasOwnProperty(ng)) {
            res.push({ngram: ng, num: ngrams[ng]});
        }
    }
    res.sort(function (a, b) {return b.num - a.num});
    return res.slice(0, count);
}

