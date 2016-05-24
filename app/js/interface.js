/**
 * @file Contains functionality for building the interface, such as Handlebars
 * template compiling.
 * @module interface
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 * @author Victor Tranell <victr593@student.liu.se>
 * @author Kristoffer Tennivaara <krite934@student.liu.se>
 */

/**
 * Initializes various interface features contained in this file.
 */
var initInterface = function() {
    createFileSelect();
    disableToolButtonBorder();
    initCustomScrollbars();
};

var createFileSelect = function() {
    var fileIndices = [];

    /*
     * Takes a number and a width and returns the number as a string
     * padded to the left with as many zeroes as needed to be width wide.
     */
    var pad = function(n, width) {
        n = n + '';
        if (n.length >= width) {
            return n;
        } else {
            return new Array(width - n.length + 1).join('0') + n;
        }
    };

    for (var i = 1; i <= appConfig.TEXT_FILE_COUNT; i++) {
        fileIndices.push(pad(i, 3));
    }

    handlebarExec('#file-select-template', '#file-section',
        {number: fileIndices});
};

/**
 * Disables the border appearing when clicking a button, affecting the tool
 * select buttons.
 */
var disableToolButtonBorder = function() {
    $(".tool-button").on("focus", function() {
        /* prevents showing the border of the button when clicked */
        $(this).blur();
    });
};

var handlebarCompile = memoize(function(theScript) {
    return Handlebars.compile(theScript);
});

var handlebarBuild = memoize(function(theTemplate, context) {
    return theTemplate(context);
});

/**
 * places the result of running the handlebars script located at
 * selector @param selScript with context @param context,
 * placing the result at @param selTarget
 *
 * @param {String} selScript selector for script source
 * @param {String} selTarget selector for destination of built script
 * @param {Object} context Handlebars context
 * @exception Error when the provided selectors do not return any elements
 *     and when context isn't an object
 */
var handlebarExec = function(selScript, selTarget, context) {
    if (typeof context !== "object") {
        throw Error("Context passed to handlebar must be an object");
    } else if (typeof selScript !== "string"
            || typeof selTarget !== "string") {
        throw Error("Selectors must be strings");
    }

    var theScriptElem = $(selScript);
    var repl = $(selTarget);
    if (theScriptElem.length === 0 || repl.length === 0) {
        throw Error("Script or target does not exist");
    }

    var theScript = theScriptElem.html();
    var theTemplate = handlebarCompile(theScript);
    var theHtml = handlebarBuild(theTemplate, context);

    if (repl.html() !== theHtml) {
        repl.html(theHtml);
    }
};

var flashDupes = function(dupes, siblingsTo) {
    var toFlash = siblingsTo.siblings().filter(function(_, ele) {
        var html = ele["innerHTML"]; /* suppress a warning */
        if (html in dupes) {
            return dupes.hasOwnProperty(html);
        }
    });

    flashSelectionRed(toFlash);
};

var flashSelectionRed = function(jQsel) {
    jQsel.addClass("redBackground");
    window.setTimeout(function() {
        jQsel.removeClass("redBackground").addClass("defaultBackground");
    }, 1000);
};

var moveCaretToStart = function(elem) {
    if (elem instanceof Node &&
            window.getSelection && document.createRange) {
        // this is to move the caret / cursor to the start
        var range = document.createRange();

        range.selectNodeContents(elem);
        range.collapse(true); // sets endpoint to the start point

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else {
        // rumors has it that this doesn't work on all browsers
        var tmp = elem.innerHTML;
        elem.innerHTML = "";
        elem.innerHTML = tmp;
    }
};

/**
 * Initiate custom scrollbars.
 * Default is vertical, to change content’s scrolling axis,
 * set axis value (string): "y", "x" or "yx".
 */
var initCustomScrollbars = function() {
    $(window).load(function() {
        $("#column-container-wrapper").mCustomScrollbar({
            axis: "y"
        });
        $("#util-bar").mCustomScrollbar({
            axis: "y"
        });
    });
};
