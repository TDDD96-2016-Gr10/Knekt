/**
 * @file Contains callback function and state of the transposition tool.
 * @module transposition
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 * @author Kristoffer Tennivaara <krite934@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 */

/**
 * State variable for keeping track of the number of columns used in the
 * transposition tool.
 * @type {number}
 */
var nCols = 4;

/**
 * Updates the decrypted text-area when number of columns changes,
 * when cipher text changes and when columns get swapped.
 */
function updateResultText() {
    var cols = document.querySelectorAll('#column-container > .trans-column');
    var colOrder = [];
    var colNum = 0;

    for (var i = 0; i < cols.length; i++) {
        // Column numbers are 1-indexed, want 0-indexed
        colNum = parseInt(cols[i].getAttribute('data-index')) - 1;
        colOrder.push(colNum);
    }

    var decrText = decryptTransposition(nCols, colOrder,
        appState.getFileText());
    $('#trans-result').html(decrText);
}

/**
 * Callback for the buttons for changing the number of columns in the
 * transposition tool.
 * @param {int} incr The number to be added to nCols
 */
function columnIncrDecr(incr) {
    if (appState.fileIsSelected()) {
        nCols += incr;
        if (nCols > 9) {
            nCols = 9;
        } else if (nCols < 2) {
            nCols = 2;
        } else {
            generateNewColumns();
        }
    }
}

/**
 * Resets the transposition column count to 4 and rearranges the columns
 * to their initial order.
 */
function resetTransTool() {
    if (appState.fileIsSelected()) {
        nCols = 4;
        // Pad cipherText to get even columns
        var context = getHandlebarsColumns(nCols,
            padText(nCols, appState.getFileText()));
        var theTemplate = handlebarCompile($("#trans-col-template").html());
        var theHtml = handlebarBuild(theTemplate, context);
        $("#column-container").html(theHtml);
        updateResultText();
    }
}

/*
 rationale for doing like this instead of
 reordering the context (which is cleaner code)
 is that using the same context allows for memoization

 this code does hint that handlebarExec should be available
 as "separate" functions
 */
function orderColumns(oldColumns, newColumns) {
    var res = [];
    oldColumns.each(function(_, elem) {
        var dataIndex = $(elem).attr("data-index");
        var element = newColumns.filter(function(_, elem) {
            return $(elem).attr("data-index") == dataIndex;
        });

        if (element.length > 0) {
            res.push(element.get(0));
        }
    });

    if (res.length && newColumns.length > res.length) {
        /* + was clicked; not run if oldColumns is empty */
        res.push(newColumns.last().get(0));
    }

    return res;
}

/**
 * Generates new columns and displays these. This happens both when the cipher
 * text changes and when the number of columns changes.
 */
function generateNewColumns() {
    // Pad with whitespace to get even columns
    var paddedText = padText(nCols, appState.getFileText());

    var context = getHandlebarsColumns(nCols, paddedText);

    var theScript = $("#trans-col-template").html();
    var theTemplate = handlebarCompile(theScript);
    var theHtml = handlebarBuild(theTemplate, context);

    var columnOrder = function(theHtml, curP) {
        /* trick-parse theHtml */
        //FIXME, cool lösning men lite okommenterad, skulle kunna ha mer beskrivande namn också
        //Lämnar till Robert att beskriva det här
        var el = $("<div></div>").html(theHtml);

        var curC = curP.children();
        var newC = el.children();

        return curC.length > 0 ? orderColumns(curC, newC) : theHtml;
    };

    var columnContainer = $("#column-container");
    var res = columnOrder(theHtml, columnContainer);
    columnContainer.html(res);

    updateResultText();
}

/**
 * Initializes the transposition tool.
 */
function initTransMngr() {
    document.body.addEventListener('fileChange', function (_) {
        $('#trans-result').html('');
        generateNewColumns();
    });

    var dragHandle = dragula([document.querySelector('#column-container')], {
        revertOnSpill: false, direction: 'horizontal'
    });

    dragHandle.on('drop', function () {
        updateResultText();
    });
}