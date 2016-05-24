/**
 * @file Contains various browser specific fixes.
 * @module fixes
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 */

// Make Internet Explorer support CustomEvent  // TODO: Should this have a proper JSDoc comment?
(function () {
    if (typeof window.CustomEvent === "function") {
        return false;
    }

    function CustomEvent (event, params) {
        params = params || {bubbles: false, cancelable: false,
                detail: undefined};
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable,
            params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();
