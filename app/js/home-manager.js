/**
 * @file Contains the functionality found in the home screen.
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 */

function initHomeMngr() {
    document.body.addEventListener('fileChange', function (e) {
        var textArea = $('#home-text-area');
        $('#home-no-file').hide();
        textArea.html(e.detail);
        textArea.show();
    });
}
