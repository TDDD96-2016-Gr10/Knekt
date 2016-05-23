/**
 * @file Handles the presentation of text di and trigram tables.
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 * @author Victor Tranell <victr593@student.liu.se>
 */

/**
 * Updates the tables showing the bi and trigram count for the currently chosen
 * text.
 * @param text the new cipher text.
 */
function updateTextNGgramTables(text) {
    var bigramContext = {label: 'Bigram', numType: 'Count'};
    var trigramContext = {label: 'Trigram', numType: 'Count'};

    if(appState.fileIsSelected()) {
        bigramContext.ngrams = getNGramCount(text, 2, 10);
        trigramContext.ngrams = getNGramCount(text, 3, 10);
    } else {
        var emptyNGrams = createEmptyContext(10);
        bigramContext.ngrams = emptyNGrams;
        trigramContext.ngrams = emptyNGrams;
    }

    handlebarExec('#ngram-table-template', '#text-bigram-table',
        bigramContext);
    handlebarExec('#ngram-table-template', '#text-trigram-table',
        trigramContext);
}

/**
 * Puts ngram-information in corresponding html tables.
 * @param bigramContext
 * @param trigramContext
 */
function plotLanguageNGramTables(bigramContext, trigramContext){
    handlebarExec('#ngram-table-template', '#language-bigram-table',
        bigramContext);
    handlebarExec('#ngram-table-template', '#language-trigram-table',
        trigramContext);
}

/**
 * Chooses the correct ngram-information depending on language
 * @param language
 */
function updateLanguageNGramTables(language) {
    /*
     * Language statistics for swedish bigrams. Data retrieved from
     * http://www2.lingfil.uu.se/ling/wp/wp6b.pdf, retrieved 2016-04-13
     * which uses the uppsala newspaper corpus.
     */
    var SWE_BIGRAM_DATA = {
        ngrams: [{
            ngram: "EN",
            num: 2.81
        },{
            ngram: "ER",
            num: 2.51
        },{
            ngram: "DE",
            num: 2.37
        },{
            ngram: "AR",
            num: 2.02
        },{
            ngram: "AN",
            num: 1.88
        },{
            ngram: "ET",
            num: 1.65
        },{
            ngram: "IN",
            num: 1.65
        },{
            ngram: "ST",
            num: 1.42
        },{
            ngram: "TE",
            num: 1.41
        },{
            ngram: "TT",
            num: 1.36
        }],
        label: 'Bigram',
        numType: 'Frequency'
    };

    /*
     * Language statistics for english bigrams. Data is retrieved from
     * http://www.cryptograms.org/letter-frequencies.php, retrieved 2016-04-13
     */
    var ENG_BIGRAM_DATA = {
        ngrams:[{
            ngram: "TH",
            num: 3.88
        },{
            ngram: "HE",
            num: 3.68
        },{
            ngram: "IN",
            num: 2.28
        },{
            ngram: "ER",
            num: 2.18
        },{
            ngram: "AN",
            num: 2.14
        },{
            ngram: "RE",
            num: 1.75
        },{
            ngram: "ND",
            num: 1.57
        },{
            ngram: "ON",
            num: 1.42
        },{
            ngram: "EN",
            num: 1.38
        },{
            ngram: "AT",
            num: 1.34
        }],
        label: 'Bigram',
        numType: 'Frequency'
    };


    /*
     * Language statistics for swedish trigram is retrieved from
     * http://www2.lingfil.uu.se/ling/wp/wp6b.pdf, retrieved 2016-04-13
     * which uses the uppsala newspaper corpus.
     */
    var SWE_TRIGRAM_DATA = {
        ngrams:[{
            ngram: "FÖR",
            num: 1.05
        },{
            ngram: "ATT",
            num: 0.86
        },{
            ngram: "ING",
            num: 0.83
        },{
            ngram: "OCH",
            num: 0.82
        },{
            ngram: "TER",
            num: 0.7.toFixed(2) //Displays 0.70, not 0.7
        },{
            ngram: "DET",
            num: 0.66
        },{
            ngram: "AND",
            num: 0.62
        },{
            ngram: "NDE",
            num: 0.6.toFixed(2)
        },{
            ngram: "SOM",
            num: 0.58
        },{
            ngram: "DEN",
            num: 0.57
        }],
        label: 'Trigram',
        numType: 'Frequency'
    };

    /*
     * Language statistics for english bigrams. Data is retrieved from
     * http://www.cryptograms.org/letter-frequencies.php, retrieved 2016-04-13
     */
    var ENG_TRIGRAM_DATA = {
        ngrams:[{
            ngram: "THE",
            num: 3.51
        },{
            ngram: "AND",
            num: 1.59
        },{
            ngram: "ING",
            num: 1.15
        },{
            ngram: "HER",
            num: 0.82
        },{
            ngram: "HAT",
            num: 0.65
        },{
            ngram: "HIS",
            num: 0.6.toFixed(2)
        },{
            ngram: "THA",
            num: 0.59
        },{
            ngram: "ERE",
            num: 0.56
        },{
            ngram: "FOR",
            num: 0.56
        },{
            ngram: "ENT",
            num: 0.53
        }],
        label: 'Trigram',
        numType: 'Frequency'
    };

    if (language === "sv") {
        plotLanguageNGramTables(SWE_BIGRAM_DATA, SWE_TRIGRAM_DATA);
    } else if (language === "en") {
        plotLanguageNGramTables(ENG_BIGRAM_DATA, ENG_TRIGRAM_DATA);
    }
}

/**
 * Add appropriate listeners for events and render the default language table.
 */
function initNGramTablesMngr() {
    document.body.addEventListener('languageChange', function (e) {
        updateLanguageNGramTables(e.detail);
    });

    document.body.addEventListener('fileChange', function (e) {
        updateTextNGgramTables(e.detail);
    });

    updateLanguageNGramTables(appState.getLang());
    updateTextNGgramTables();
}
