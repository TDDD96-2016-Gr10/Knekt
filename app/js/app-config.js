/**
 * @file Contains configuration parameters used throughout the application.
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 */

var appConfig = appConfig || {};

// Path to the directory with the encrypted text files relative to index.html.
// The final '/' denoting a folder should be excluded
appConfig.CRYPTO_TEXT_PATH = 'res';

// The number of encrypted text files available
appConfig.TEXT_FILE_COUNT = 102;
