/**
 * @file This module calls all the other modules' initialization functions,
 * making the other modules register their event listeners etc.
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 */

/**
 * Call all initialization functions. Logic modules are strictly functional in
 * the sense that they have no state or side effects, and thus doesn't need
 * any initialization.
 */
$(function () {
    // Initialize app-state first, since many modules depend on this.
    initAppState();

    // Interface modules
    initInterface();

    // Manager modules
    initBigramFactorMngr();
    initNGramTablesMngr();
    initStatChartsMngr();
    initHomeMngr();
    initViewMngr();
    initSubstMngr();
    initTransMngr();
    initVigMngr();

    // Miscellaneous modules
    initAbout();
});
