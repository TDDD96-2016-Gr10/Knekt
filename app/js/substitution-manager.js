/**
 * @file Substitution tool.  // TODO: Can this be elaborated on?
 * @module substitution-manager
 * @author Kimberley French <kimfr230@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 */

/**
 * Initializes the substitution tool.
 */
function initSubstMngr() {
    substResetTool();
    document.body.addEventListener("fileChange", function(e) {
        substResetTool("fileChange", e.detail);
    });
    document.body.addEventListener("languageChange", function() {
        substResetTool("resetDecrypted");
    });
}


/**
 * Sets input callbacks for all divs that are children to #crypto-alphabet
 * @exception bubbles
 * @see getRegexForLang
 */
function setupInputCallbacks() {
    /**
     *  keydown events are not fired for "double-tap" chars, like ´, ` and ¨
     * (and variations of these, like shift/alt-¨ (^, ~))
     *
     * keydown fires for array keys and newlines while keypress events are not
     */
    var inputBoxes = $(".alphabet-editable").children();

    inputBoxes.on("keydown", function() {
        moveCaretToStart(this);
    });

    inputBoxes.keyboardEvents("backspace del", function() {
        var me = $(this);
        /* some keys are translated into tags and html codes;
         like a newline is <br> (which is more than 1 char)
         and space is &nbsp;  -- thus, it's easier to just
         "clear it" */

        if (!me.isEmpty()) {
            me.html("");
            updatePartnerSubstBet(this);
        } else {
            me.prev().focus();
        }
    });

    inputBoxes.keyboardEvents("newline right", function() {
        $(this).next().focus();
    });

    inputBoxes.keyboardEvents("left", function() {
        $(this).prev().focus();
    });

    inputBoxes.keyboardEvents("up down", function() {
        /* todo: this feels ... */
        var parent = this.parentNode, target;
        if (parent.id === "plain-alphabet") {
            target = $("#crypto-alphabet");
        } else if (parent.id === "crypto-alphabet") {
            target = $("#plain-alphabet");
        }

        var i = $(this).index();
        target.children().eq(i).focus();
    });

    /**
     *  so um, input events are fired for weird chars, copy-pastes, and similar
     * so we'll use those to trim our fields
     *
     * notes:
     * * input events are not cancelable
     * * doesn't allow us to easily detect what was input'd
     */
    inputBoxes.on("input", function() {
        var me = $(this);
        var textInBox = me.html();

        var lang = $('#lang-select').val();
        if (!textInBox.match(getRegexForLang(lang))) {
            console.log("subst: illegal char entered");
            me.html("");
        } else if (textInBox.length > 0) {
            me.html(textInBox.charAt(0).toUpperCase());
        }

        updatePartnerSubstBet(this);
        return true;
    });
}

/**
 * updates the "partner" substitution alphabet. input is checked for dupes
 *
 * if a dupe is detected, this element is cleared and update is aborted
 *
 * when all is well, the encrypted/decrypted message is updated
 */
function updatePartnerSubstBet(changedNode, loopDetected) {
    var computeSubstAlphabet = function(parentNode) {
        var res = {};
        if (parentNode.id === "plain-alphabet") {
            res = updateSubstAlphabets("#plain-alphabet", "#crypto-alphabet");
            /* returns an alphabet for key(encrypted)->value(decrypted)
             * so no flipping is necessary
             */
        } else if (parentNode.id === "crypto-alphabet") {
            res = updateSubstAlphabets("#crypto-alphabet", "#plain-alphabet");
            /* returns alphabet for key(decrypted)->value(encrypted), whereas
             * we for decryption want key(encrypted)->value(decrypted)
             */
            if (res.val) {
                res.val = invertObject(res.val);
            }
        }
        return res;
    };

    var substAlphabet = computeSubstAlphabet(changedNode.parentNode);

    var me = $(changedNode);
    if (substAlphabet.dupes) {
        me.html("");

        if (!loopDetected) {
            /* since we modified ourselves, we need to rebuild the
             * substAlphabet etc.
             *
             * however, e.g. browser autofill could cause a loop here,
             * so we'll pass ["internal"] for loop detection */
            updatePartnerSubstBet(changedNode, true);

            /* notify the entity between keyboard and chair ;>
             *
             * todo: flash (and focus() in next block) feels misplaced */
            flashDupes(substAlphabet.dupes, me);
        }
    } else if (!loopDetected && me.html().length === 1) {
        /* no dupes were detected this chain of events, we
         * should move the focus if the element that was changed
         * still has a letter in it */
        if (me.is(":focus")) {
            me.next().focus();
        }
    }

    updateMessageDivs(substAlphabet.val);
    return true;
}

/**
 * Reads the alphabet sourced at jqSource and computes a substitution
 * alphabet that it uses to overwrite jqTarget. Since Javascript is single-
 * threaded, updates from different one sources will be written to their
 * target by the time any new update is called.
 *
 * @param jqSource selector for the source alphabet
 * @param jqTarget selector for the alphabet to be overwritten
 *
 * @see initAlphabet
 * @returns {*} an object containing the substitution alphabet or the dupes
 */
function updateSubstAlphabets(jqSource, jqTarget) {
    var getNormalAlphabet = function(source) {
        return $(source).siblings(".normal-alphabet").children();
    };

    var sourceSubstbet = $(jqSource).children().toInnerHTMLArray();
    var dupes = getDuplicates(sourceSubstbet);
    if (objectSize(dupes) != 0) {
        return {"dupes":dupes};
    }

    var alphabet = [], invSubstAlphabet = {};
    var sourceAlphabet = getNormalAlphabet(jqSource);
    sourceAlphabet.each(function(i, elem) {
        alphabet[i] = elem.innerHTML;
        var substLetter = sourceSubstbet[i];
        if (substLetter) {
            invSubstAlphabet[substLetter] = elem.innerHTML;
        }
    });

    var targetSubstbet = $(jqTarget).children();
    targetSubstbet.each(function(i, elem) {
        var letter = alphabet[i];
        var repl = invSubstAlphabet[letter] || "";
        $(elem).html(repl);
    });

    { /* todo: find a better home and/or name this... block */
        var makeSourceTransparent = function(source, container) {
            source.removeClass("transparent-letter").each(function() {
                if (container.indexOf(this.innerHTML) > -1) {
                    $(this).addClass("transparent-letter");
                }
            })
        };

        var targetAlphabet = getNormalAlphabet(jqTarget);
        var targetSubst = targetSubstbet.toInnerHTMLArray();
        makeSourceTransparent(sourceAlphabet, sourceSubstbet);
        makeSourceTransparent(targetAlphabet, targetSubst);
    }

    return {"val":invSubstAlphabet};
}

/**
 * Calculates changes to be made to the front page. When a line is outdated,
 * it is updated.
 *
 * @param {Object} substAlphabet
 * @see initAlphabet
 * */
function updateMessageDivs(substAlphabet) {
    if (typeof substAlphabet !== "object") {
        return false;
    }

    var msgDivs = $("#message-divs");
    var decrRows = $(".decr-msg-row", msgDivs);
    var encrRows = $(".encr-msg-row", msgDivs).toInnerHTMLArray();

    var numChanged = 0;
    decrRows.each(function(i, elem) {
        var line = encrRows[i];
        var decryptedLine = decryptLine(line, substAlphabet);
        var currentDecryptedLine = elem.innerHTML;
        if (decryptedLine !== currentDecryptedLine) {
            numChanged++;
            $(elem).html(decryptedLine);
        }
    });
    console.log("subst:", numChanged, "line(s) affected by update");

    return true;
}

/**
 * Reset the page by re-computing any handlebar styles.
 * Specifically handles fileChange and languageChange events.
 * Also gets called on by the 'reset tool'-button.
 */
function substResetTool(type, message) {
    var alphabet = initAlphabet(appState.getLang());

    if (type == "fileChange" && message) {
        handlebarMessageDivs(message, alphabet);
    }

    console.log("subst: resetting tool");

    handlebarAlphabetDivs(alphabet);
    handlebarCryptobetDivs(alphabet);
    setupInputCallbacks();

    if (type == "resetDecrypted") {
        updateMessageDivs(alphabet);
    }
}

/**
 * Callback for the elements that have the attribute of being droppable
 * @param {Event} ev event with the dataTransfer and target properties
 * @see substDrag
 */
function substDrop(ev) {
    var edt = ev["dataTransfer"];
    if (edt && ev.target && edt.getData) {
        ev.target.innerHTML = edt.getData("source");
        $(ev.target).blur(); /* fixes visual issue with webkit based browsers */
        $(ev.target).trigger("input");
    } else {
        alert("dropping not supported by this browser");
    }

    ev.preventDefault();
}

/**
 * Callback for the elements that have the attribute of being draggable
 * @param {Event} ev event with the dataTransfer and target properties
 * @see substDrop
 */
function substDrag(ev) {
    var edt = ev["dataTransfer"];
    if (edt && ev.target && edt.setData) {
        edt.setData("source", ev.target.innerHTML);
    } else {
        alert("drag-and-drop is not supported on this browser");
        ev.preventDefault();
    }
}
