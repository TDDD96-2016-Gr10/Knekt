/**
 * @file Controls the navigation between the different views of the
 * application.
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 * @author Oscar Johansson  <oscjo411@student.liu.se>
 * @author Kimberley French <kimfr230@student.liu.se>
 */

var utilState = utilState || {};


/**
 * Initializes the view manager module.
 */
function initViewMngr() {
    initUtilState();
    initUtilDrag();
}

/**
 * Initiate the utilState object/namespace
 */
function initUtilState() {
    var toolOrder = [];
    $('#util-tools').children('.graph-container').each(function () {
        toolOrder.push(this);
    });

    $("#cipher-tool").children().each(function() {
        utilState[this.id] = {
            order:toolOrder,
            openTools:{}
        };
    });

    /* fixme / review notes: i liked getCurrentTool() better than maintaining
     activeView. Both have issues. I have a personal quest where i try to reduce
     the amount of state that needs to be maintained in the code. with
     getCurrentTool { for each tool; if visible return tool }
     activeView comes at a computation cost, but a reduction of state
     with benefits in maintainability
     fixme Review notes2: Agreed, + for maintainability.
     */
    utilState.HOME = 'home-view';
    utilState.activeView = utilState.HOME;
}

/**
 * Initiate util tool drag functionality.
 */
function initUtilDrag() {
    var drake = dragula([document.querySelector('.graph-area')],
        {revertOnSpill: true, direction: 'vertical',
            moves: function (el, container, handle){
                return handle.classList.contains('graph-container-header');
            }
        }
    );

    drake.on('drop', function() {
        saveUtilOrder();
    });
}

/**
 * Gets called when the user clicks a button to change the view.
 * @param {String} view html-id of the view to be shown
 * @param {Element} elem DOM element that was clicked on
 */
function viewChange(view, elem) {
    var newView = view !== utilState.activeView;

    if (view == utilState.HOME) {
        $('.tool-button').removeClass('tool-button-active');
    } else {
        $('.tool-button').not(this).removeClass('tool-button-active');
        $(elem).addClass('tool-button-active');
    }

    $('#cipher-tool').children().each(function () {
        if (this.id !== view) {
            $(this).hide();
        } else {
            $(this).show();
            utilState.activeView = this.id;
            $(this).trigger('viewChange');
        }
    });

    if (newView) {
        loadUtilState();
    }
}

/**
 * Gets called when the user clicks the div-header for a graph.
 * Changes visibility, arrow direction and the state of the changed graph
 * @param {String} header the util header being clicked
 */
function expandCollapseGraph(header) {
    var container = $(header).parent();
    var containerId = container.attr('id');
    var content = container.children('graph-container-content');

    // If an animation is currently in progress, ignore additional clicks
    if (content.is(':animated')) {
        return;
    }

    var prevState = utilState[utilState.activeView].openTools[containerId];
    utilState[utilState.activeView].openTools[containerId] = !prevState;
    setVisibilityOf(container, !prevState);

    window.dispatchEvent(new Event('resize'));
}

/**
 * Opens or closes the util residing in the container with id contId depending
 * on the value of visible. This does not affect the maintained state of the
 * views, it just modifies the interface.
 * @param {String} contId id of the util container
 * @param {Boolean} visible visible or close the util
 */
function setVisibilityOf(container, visible) {
    var contentClass = '.graph-container-content';
    var headerClass = '.graph-container-header';
    var container = $(container);
    var content = container.children(contentClass);
    var arrow = container.children(headerClass).children(0);

    $(arrow).removeClass();
    $(arrow).addClass(visible ? 'arrow-down' : 'arrow-right');
    if (visible) {
        $(content).stop().slideDown(200); // .stop() stops previous animations
    } else {
        $(content).stop().slideUp(200); // .stop() stops previous animations
    }
}

/**
 * Save the order of the utils for the current tool. Gets called by a dragula
 * event handler when a util tool has been dragged and dropped.
 */
function saveUtilOrder() {
    var toolOrder = [];

    $('#util-tools').children('.graph-container').each(function () {
        toolOrder.push(this);
    });

    utilState[utilState.activeView].order = toolOrder;
}

/**
 * Opens/closes utils to match the state of a newly chosen view.
 */
function loadUtilState() {
    var collapseAllUtil = function () {
        $('#util-tools').children('.graph-container').each(function () {
            setVisibilityOf(this, false);
        });
        setTimeout(changeUtilOrder, 200);
    };

    var changeUtilOrder = function () {
        var toolOrder = utilState[utilState.activeView].order;
        for (var i = 0; i < toolOrder.length - 1; i++) {
            $(toolOrder[i + 1]).insertAfter(toolOrder[i]);
        }
        setTimeout(showUtil, 200);
    };

    var showUtil = function () {
        var content = $('#util-tools').children('.graph-container');
        content.each(function () {
            if (utilState[utilState.activeView].openTools[this.id]) {
                setVisibilityOf(this, true);
            }
        });

        // Resize the highcharts. When redrawing while hidden the graphs get
        // the wrong width.
        window.dispatchEvent(new Event('resize'));
    };

    collapseAllUtil();
}
