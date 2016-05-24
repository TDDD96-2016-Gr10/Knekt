/**
 * @file Handles the presentation of the text bigram factors.
 * @module bigram-factor-manager
 * @author Erik Rönmark <eriro331@student.liu.se>
 */

/**
 * updates the table for bigram factors for the chosen text
 * @param {string} text the new crypto text.
 *
 * TODO: On merge use handlebarExec()
 */
function updateBigramFactorTable(text) {
    handlebarExec('#bigram-factor-table-template', '#bigram-factor-table', {bigram: getBigramFactors(text)});
}

function initBigramFactorMngr() {
    document.body.addEventListener('fileChange', function (e) {
        updateBigramFactorTable(e.detail);
    });
}
