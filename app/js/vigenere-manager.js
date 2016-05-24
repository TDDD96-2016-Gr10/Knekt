/**
 * @file Manager file for Vigenere tool
 * @author Victor Tranell <victr593@student.liu.se>
 * @author Erik Rönmark <eriro331@student.liu.se>
 * @author Rebecka Geijer Michaeli <rebge882@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 */


/**
 * Initializes the Vigenere tool.
 *
 * Add listener for file changes and language changes.
 * Also set up callbacks for key changing events
 */
var initVigMngr = function() {
    document.body.addEventListener('fileChange', function (_) {
        resetVigenere();
    });
    document.body.addEventListener('languageChange', resetVigenere);

    resetVigenere();

    // fixme/todo: use new initialisation method instead
    $("#vig-tool").one("viewChange", function() {
        // workaround for highcharts sizing
        window.dispatchEvent(new Event('resize'));
    });
};

/**
 * Resets the Vigenere tool to original settings
 */
var resetVigenere = function() {
    handlebarVigenereKey(3, {resetKey:true});
    vigenereSetupInputCallbacks();
    updateVigenereText();
    redrawFixedGraph();
    recalculateShiftedGraph();
    //set shift-buttons tounclickable
    $(".vig-shift-button").addClass("blur-active");
};

/**
 * Sets input callbacks for all divs that are children to #vigenere-key-boxes
 */
var vigenereSetupInputCallbacks = function() {
    var vigKeys = $(".vigenere-key");

    vigKeys.on("keypress", function() {
        /* todo: include key navigation etc */
        moveCaretToStart(this);
    });

    vigKeys.keyboardEvents("right", function() {
        $(this).next().focus();
    });

    vigKeys.keyboardEvents("left", function() {
        $(this).prev().focus();
    });

    vigKeys.on("input", function() {
        var me = $(this);
        var textInBox = me.html();

        /* todo: fix after subst merge */
        var lang = $('#lang-select').val();
        if (!textInBox.match(getRegexForLang(lang))) {
            console.log("vig: illegal char entered");
            me.html("");
        } else {
            me.html(textInBox.charAt(0).toUpperCase());
        }

        updateVigenereText();
        recalculateShiftedGraph(this);
    });

    vigKeys.on("focus", function() {
        $(this).siblings().removeClass("vig-active-letter");
        $(this).addClass("vig-active-letter");
        recalculateShiftedGraph(this);
    });

    $("#vig-buttons").children("button").on("click", function() {
        if ($(this).hasClass("button-plus")) {
            vigKeyLenAdjust(1);
        } else {
            vigKeyLenAdjust(-1);
        }

        recalculateShiftedGraph(this);
    });

    $(".vig-left-shift-button").off("click").on("click", function() {
        if (!$(this).hasClass("blur-active")) {
            vigShift(1);
            recalculateShiftedGraph();
            updateVigenereText();
        }
    });
    $(".vig-right-shift-button").off("click").on("click", function() {
        if (!$(this).hasClass("blur-active")) {
            vigShift(-1);
            recalculateShiftedGraph();
            updateVigenereText();
        }
    });
};

/**
 * Shifts active Vigenere key letter adjust steps
 * @param adjust int representing the shift, can be both positive and negative. -1 turns B into A
 */
var vigShift = function(adjust) {
    var activeLetter = $(".vig-active-letter").get(0);
    if (!activeLetter) {
        return;
    }

    var lang = $("#lang-select").val();
    var alphabet = getAlphabet(lang);
    var letterIndex = alphabet.indexOf(activeLetter.innerHTML);
    if (letterIndex === -1) {
        console.log("active letter not in alphabet")
    } else {
        var newIndex = (letterIndex + adjust + alphabet.length) % alphabet.length;
        var repl = alphabet[newIndex];

        activeLetter.innerHTML = repl;
    }
};

/**
 * Recalculates and redraws the upper shiftable graph
 * @param elem Letter used to shift the graph. If not provided active letter is used instead
 */
var recalculateShiftedGraph = function(elem) {
    elem = elem || $(".vig-active-letter").get(0);
    var redrawok;
    if (elem && elem.innerHTML) {
        var content = elem.innerHTML;

        var lang = $("#lang-select").val();
        var alphabet = getAlphabet(lang);

        var letterIndex = alphabet.indexOf(content);

        var letterOffset = (alphabet.length /* alphabet.indexOf("A") === 0 */ + letterIndex) % alphabet.length;

        var indexInKey = parseInt(elem.getAttribute("data-key-index"));
        redrawok = redrawShiftableGraph(indexInKey, letterOffset);
    } else {
        redrawok = redrawShiftableGraph(0, 0);
    }

    if (redrawok) { //set shift buttons clickable
        $(".vig-shift-button").removeClass("blur-active");
    } else {
        $(".vig-shift-button").addClass("blur-active");
    }
};

/**
 * Changes both the graphical and the logical size of the key
 * @param adjustment
 */
var vigKeyLenAdjust = function(adjustment) {
    var key = $(".vigenere-key");
    var length = key.length + adjustment;
    if (length >= 2 && length <= 8) {
        handlebarVigenereKey(length);
    }

    //the buttons are recreated, therefore we need to do this
    vigenereSetupInputCallbacks();
    updateVigenereText();
};

/**
 * Called whenever we need to decipher again.
 */
var updateVigenereText = function() {
    var key = getVigKey();
    var lang = appState.getLang();
    var txt = appState.getFileText();
    $("#vig-result").text(decipherVigenereString(txt, key, lang));
};

/**
 * Returns the whole key as a string from the vigInputBoxes in the tool
 * @returns {string} key
 */
var getVigKey = function() {
    var keyText = "";

    $(".vigenere-key").each(function(){
        keyText += $(this).text() || "A";
    });

    return keyText
};
