/**
 * @file Contains logic for calculating bigram factors.
 * @author Erik Rönmark <eriro331@student.liu.se>
 */

/**
 * Takes an encrypted text and a bigram and returns
 * an array of the distances between each pair, of
 * the specified bigram, in the encrypted text. Does
 * not count each pair twice.
 * @param {string} cryptoText the decrypted text
 * @param {string} bigram the bigram to analyze
 * @returns {Array} an array of distances between
 * bigram pairs.
 */
//TODO seems to miss some case compared to old program, even when using all bigram instead of the 10 most common
function getBigramDistances(cryptoText, bigram) {
    var diagramDistanceArray = [];
    var outerIndex = cryptoText.indexOf(bigram);
    while (outerIndex !== -1) {
        var innerIndex = 0;
        while (true) {
            innerIndex = cryptoText.indexOf(bigram, innerIndex + outerIndex + 1);
            if (innerIndex === -1) {
                break;
            } else {
                diagramDistanceArray.push(innerIndex - outerIndex);
            }
        }
        outerIndex = cryptoText.indexOf(bigram, outerIndex + 1);
    }
    return diagramDistanceArray;
}

/**
 * Goes through the 10 most common bigrams found in text,
 * finding the distance between each pair, looking for every
 * factor 2 trough 8 and adds them to an array.
 * @param {string} cryptoText the decrypted text
 * @returns {Array} count of occurring distances of factors 2 trough 8,
 * the index is the factor, the element is the number of occurrences.
 */
function getBigramFactors(cryptoText) {
    var bigrams = getNGramCount(cryptoText, 2, 50);
    var bigramFactorArray = [{nr: 2, count: 0}, {nr: 3, count: 0},
        {nr: 4, count: 0}, {nr: 5, count: 0}, {nr: 6, count: 0},
        {nr: 7, count: 0}, {nr: 8, count: 0}];
    for (var i = 0; i < bigrams.length; i++) { // For every bigram
        var bigramDistanceArray = getBigramDistances(cryptoText, bigrams[i].ngram);
        // For every sought factor
        for (var j = 2; j < bigramFactorArray.length + 2; j++) {
            // For every diagram distance
            for (var k = 0; k < bigramDistanceArray.length; k++) {
                if (bigramDistanceArray[k] % j === 0) { // If factor j
                    bigramFactorArray[j - 2].count += 1;
                }
            }
        }
    }
    return bigramFactorArray;
}
