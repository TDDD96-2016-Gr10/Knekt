/**
 * @file Contains functions that provide a unified way of accessing the
 * current state of the application.
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 * @author Robert Kumpulainen <robku937@student.liu.se>
 */

/**
 * The constructor for the AppState class.
 *
 * This approach is used to be able to implement private data members in a
 * convenient way. There are known problems with this approach, for example
 * that the methods are declared in the object instead of the prototype, which
 * effectively means that every object gets a copy of every method which is
 * very memory inefficient. It also complicates inheritance. But since this
 * class is only instantiated once, and no classes inherit from it this
 * approach should suffice.
 * @param {String} initLang the initial language state
 * @param {String} initFileName the initial file name state
 * @constructor
 */
function AppState(initLang, initFileName) {
    var _lang = initLang;
    var _fileName = initFileName;
    var _fileText = '';
    var _textCache = {};

    /**
     * Returns the currently selected and applied language code ('en' or 'sv').
     * @returns {String}
     */
    this.getLang = function () {
        return _lang;
    };

    /**
     * Returns the currently selected and applied file name.
     * @returns {String}
     */
    this.getFileName = function () {
        return _fileName;
    };

    /**
     * Returns the currently selected and applied file text.
     * @returns {string}
     */
    this.getFileText = function () {
        return _fileText;
    };

    /**
     * Returns true if a file is currently selected, else false.
     * @returns {boolean}
     */
    this.fileIsSelected = function () {
        return _fileName !== undefined;
    };

    /**
     * Called when the user presses the Apply settings button. Removes the
     * visual indication that the settings have changed and executes the
     * routines performing the changes.
     */
    this.applySettings = function () {
        var langSel = $('#lang-select');
        var fileSel = $('#file-select');
        var chg = 'changed-setting';

        if (langSel.hasClass(chg)) {
            _lang = langSel.val();
            applyLangChange();
        }
        if (fileSel.hasClass(chg)) {
            _fileName = fileSel.val();
            applyFileChange();
        }

        clearSettingIndications();
        $('#apply-button').prop('disabled', true);
    };

    /**
     * Checks the private text cache for the text associated with fileName.
     * Returns the text if there is a cache hit, else null.
     * @param fileName the cache key to check
     * @returns {String}
     */
    var textCacheLookup = function (fileName) {
        var text = _textCache[fileName];
        return text ? text : null;
    };

    /**
     * Adds text to the cache with the key fileName.
     * @param fileName the new key
     * @param text the text associated with fileName
     */
    var textCacheAdd = function (fileName, text) {
        var alreadyCached = _textCache[fileName];
        if (!alreadyCached) {
            _textCache[fileName] = text;
        }
    };

    /**
     * Gets called whenever the user changes the currently active file.
     * Replaces the appState.getFileText() function with a new function that
     * returns the newly chosen text.
     */
    var applyFileChange = function () {
        var newText = textCacheLookup(_fileName);

        if (!newText) {
            $.ajax({
                url: appConfig.CRYPTO_TEXT_PATH + '/' + _fileName,
                dataType: 'text',
                success: function (data) {
                    data = data && data.toUpperCase();

                    _fileText = data;
                    textCacheAdd(_fileName, _fileText);

                    var fce = new CustomEvent('fileChange', {detail: data});
                    document.body.dispatchEvent(fce);
                },
                error: function () {
                    alert("Failed to get file.");
                    console.log('AJAX-call to get text file failed.');
                }
            });
        } else {
            _fileText = newText;
            var fce = new CustomEvent('fileChange', {detail: _fileText});
            document.body.dispatchEvent(fce);
        }
    };


    /**
     * Gets called when the user changes the text language.
     * Fires a languageChange event, with the language code as the .detail
     * member. The language codes are 'en' and 'sv'.
     */
    var applyLangChange = function () {
        var lce = new CustomEvent('languageChange', {detail: _lang});
        document.body.dispatchEvent(lce);
    }
}

/**
 * Initiate the appState
 */
var appState;

function initAppState() {
    // These are needed because the form doesn't reset on a "soft" page reload
    appState = new AppState($('#lang-select').val(), $('#file-select').val());
    $('#apply-button').prop('disabled', true);
}


/**
 * Gets called whenever a setting is changed by the user. Visually marks the
 * changed setting.
 * @param {String} setting string indicating the changed setting
 */
function settingsChange(setting) {
    var fileSel = $('#file-select');
    var langSel = $('#lang-select');
    var chg = 'changed-setting';
    var last = 'last-setting';
    var curState;
    var select;

    if (setting === 'lang') {
        curState = appState.getLang();
        select = langSel;
    } else if (setting === 'file') {
        curState = appState.getFileName();
        select = fileSel;
    } else {
        throw Error('No setting of type: ' + setting);
    }

    if (select.val() !== curState) {
        select.addClass(chg);
        select.children().each(function () {
            if ($(this).val() === curState) {
                $(this).addClass(last);
            }
        });
    } else {
        select.removeClass(chg);
        $('option:selected', select).removeClass(last);
    }

    var applyState = !(langSel.hasClass(chg) || fileSel.hasClass(chg));
    $('#apply-button').prop('disabled', applyState);
}

/**
 * Removes all visual indications from the settings. Does not affect the apply
 * button in any way.
 */
function clearSettingIndications() {
    var langSel = $('#lang-select');
    var fileSel = $('#file-select');
    var chg = 'changed-setting';
    var lst = 'last-setting';
    langSel.removeClass(chg);
    fileSel.removeClass(chg);
    langSel.children('option').removeClass(lst);
    fileSel.children('option').removeClass(lst);
}
