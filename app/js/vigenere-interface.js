/**
 * @file Vigenere interface builder
 * @author Victor Tranell <victr593@student.liu.se>
 * @author Erik Rönmark <eriro331@student.liu.se>
 * @author Rebecka Geijer Michaeli <rebge882@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 */

/**
 * Redraws the language statistics graph, for the language selected by the user
 */
var redrawFixedGraph = function() {
    var lang = $("#lang-select").val();

    if (lang === "sv") {
        plotGraph('#vig-fixed-graph',swedishGraphData,'Swedish letter statistics','column',
            Object.keys(swedishStats),'Frequency (%)',true);
    } else if (lang === "en") {
        plotGraph('#vig-fixed-graph',englishGraphData,'English letter statistics','column',
            Object.keys(englishStats),'Frequency (%)',true);
    } //no else
};

/**
 * @param shiftedSteps positive or negative relative to the cryptoText
 * @param offsetInKey between 0 and keyLength
 */
//todo: refactor code, this is quick fix
var redrawShiftableGraph = function(offsetInKey, shiftedSteps) {
    var lang = appState.getLang();
    var text = appState.getFileText();

    //no file choosen
    if (!appState.fileIsSelected()) {
        plotGraph("#vig-movable-graph", initAlphabet(lang), "Please" +
            " choose a file",
            "column", {}, "", false, "No file loaded");
        return;
    }

    //no key letter choosen
    var activeLetter = $(".vig-active-letter").get(0);
    if (!activeLetter) {
        plotGraph("#vig-movable-graph", initAlphabet(lang), "Please select a key letter",
                  "column", {}, "", false, "Please select a key letter");
        return;
    }

    var key = getVigKey();
    var alphaObj = initAlphabet(lang);
    for (var k in alphaObj) {
        if (alphaObj.hasOwnProperty(k)) {
            alphaObj[k] = 0;
        }
    }

    var toDraw = vigLetterGraph(offsetInKey, key.length, text, alphaObj);
    toDraw.data = shiftArray(toDraw.data, shiftedSteps);
    toDraw.color = bar_color;
    var shiftedKeys = shiftArray(Object.keys(alphaObj), shiftedSteps);
    plotGraph("#vig-movable-graph", toDraw, "Letters shifted by selected key letter",
        "column", shiftedKeys, "Occurrences", false);

    return true;
};

/**
 * Generetes boxes for vigenere key
 * @param {number} keyLength length of the key
 * @param {(Object|undefined)} opt filled with {resetKey:true} resets the key, otherwise the old key is kept
 */
var handlebarVigenereKey = function(keyLength, opt) {
    if (typeof keyLength !== "number") {
        throw Error("keyLength must be an number");
    }

    var context = {
        keyLetter: []
    };

    for (var i = 0; i < keyLength; ++i) {
        context.keyLetter.push("A");
    }

    opt = opt || {};

    var theScript = $("#vigenere-key-hbs").html();
    var theTemplate = handlebarCompile(theScript);
    var theHtml = handlebarBuild(theTemplate, context);
    var keyHtml = $("#vig-key");

    if (!opt.resetKey) {
        /* copies old key into new key */
        var newHtml = $("<div></div>");
        newHtml.html(theHtml);

        var oldKey = keyHtml.children();

        newHtml.children().each(function(i, elem) {
            var repl = oldKey.get(i);
            if (repl) {
                $(elem).html(repl.innerHTML);
                $(elem).addClass(repl.className);
            }
        });

        theHtml = newHtml.html();
    }
    keyHtml.html(theHtml);
};
