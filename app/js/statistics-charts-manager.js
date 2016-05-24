/**
 * @file This file holds letter statistics for Swedish and English.
 * It also creates a graph for the stats and has an event listener for the
 * language selector in index.html
 * @module statistics-charts-manager
 * @author Eric Henziger <erihe763@student.liu.se>
 * @author Erik Rönmark <eriro331@student.liu.se>
 * @author Victor Tranell <victr593@student.liu.se>
 * @author Oscar Johansson <oscjo411@student.liu.se>
 * @author Kimberley French <kimfr230@student.liu.se>
 */

/* Get the highchart font from CSS. The font is modified in _interface.scss */
var chart_font = window.getComputedStyle(document.querySelector("html")).getPropertyValue("--chartFont");

/* Get the bar color from CSS. The bar-color is modified in _interface.scss */
var bar_color = window.getComputedStyle(document.querySelector("html")).getPropertyValue("--bar-color");

/**
 * The letter statistics for Swedish, stored as an object.
 * The keys are strings of the capital letters of the alphabet, the values are
 * percentages.
 * @type {Object}
 * @const
 */
var swedishStats = {'A': 9.383, 'B': 1.535, 'C': 1.486, 'D': 4.702, 'E': 10.149, 'F': 2.027, 'G': 2.862, 'H': 2.090,
    'I': 5.817,'J': 0.614, 'K': 3.140, 'L': 5.275, 'M': 3.471, 'N': 8.542, 'O': 4.482, 'P': 1.839, 'Q': 0.020,
    'R': 8.431, 'S': 6.590, 'T': 7.691, 'U': 1.919, 'V': 2.415, 'W': 0.142, 'X': 0.159, 'Y': 0.708, 'Z': 0.070,
    'Å': 1.338, 'Ä': 1.797, 'Ö': 1.305};

/**
 * The letter statistics for English, stored as an object.
 * The keys are strings of the capital letters of the alphabet, the values are
 * percentages.
 * @type {Object}
 * @const
 */
var englishStats = {'A': 8.167, 'B': 1.492, 'C': 2.782, 'D': 4.253, 'E': 12.702, 'F': 2.228, 'G': 2.015, 'H': 6.094,
    'I': 6.966, 'J': 0.153, 'K': 0.772, 'L': 4.025, 'M': 2.406, 'N': 6.749, 'O': 7.507, 'P': 1.929, 'Q': 0.095,
    'R': 5.987, 'S': 6.327, 'T': 9.056, 'U': 2.758, 'V': 0.978, 'W': 2.360, 'X': 0.150, 'Y': 1.974, 'Z': 0.074};

try {
    var swedishGraphData = {
        name: 'Swedish',
        data: getValuesFromObject(swedishStats),
        font: chart_font,
        color: bar_color
    };

    var englishGraphData = {
        name: 'English',
        data: getValuesFromObject(englishStats),
        font: chart_font,
        color: bar_color
    };
} catch (e) {
    if(e instanceof TypeError) {
        console.log("Invalid stats parameter when calling getValuesFromObject:" + e.message);
    }

}

var cryptoGraphData = {
    name: '',
    data: [],
    color: bar_color,
    font: chart_font
};

/**
 * Function for plotting Highcharts,
 * @param {string} container specifies which container to put the plot in (include #, . etc)
 * @param {object} series the dataseries to plot
 * @param {string} title the tile of the plot
 * @param {string} chartType the type of chart used (usually 'column')
 * @param {string[]} categories array of strings (usually the series keys)
 * @param {string} yAxisTitle
 * @param {boolean} enableAnimation set to false if you want to turn off
 * animations
 * @param {string} noDataText specifies what text should be shown when
 * the chart cannot find any data
 * @param {function} tooltipFormatter Optional, format function for tooltip
 */
var plotGraph = function(container,series,title,chartType,categories,yAxisTitle,enableAnimation,noDataText,tooltipFormatter) {
    tooltipFormatter = tooltipFormatter || function() {
            return this.x + ': <b>' + this.y + '</b>';
    };
    noDataText = noDataText || "No data available";
    $(container).highcharts({
        chart: {
            type: chartType,
            style: {
                fontFamily: chart_font,
                fontSize: '12px'
            },
        },
        title: {
            text: title,
            style: {
                fontFamily: chart_font,
                fontSize: '14px'
            },
        },
        xAxis: {
            categories: categories,
            labels: {
                step: 1
            }
        },
        yAxis: {
            title: {
                text: yAxisTitle
            },
            tickInterval: 3,
            min: 0
        },
        legend: {
            enabled: false
        },

        tooltip: {
            formatter: tooltipFormatter
        },
        plotOptions: {
            series: {
                pointPadding: 0,
                groupPadding: 0.1,
                borderWidth: 0,
                shadow: false,
                animation: enableAnimation
            }
        },
        lang: {
            noData: noDataText
        },
        credits: false,
        series: [series]
    });
};

var setCryptoGraphData = function(language, stats) {
    if (language === 'sv') {
        cryptoGraphData.name = 'Swedish';
    } else if (language === 'en') {
        cryptoGraphData.name = 'English';
    }
    if (appState.getFileText()) {
        try {
            cryptoGraphData.data = getValuesFromObject(stats);
        } catch (e) {
            if (e instanceof TypeError) {
                console.log("Invalid parameter stats: " + e.message);
            }
        }
    } else {
        cryptoGraphData.data = [];
    }
};

var plotGraphs = function(language) {
    var cryptoStats;
    var cryptoText = appState.getFileText();
    if (language === "sv") {

        plotGraph('#language-stats-area',swedishGraphData,'Swedish letter statistics','column',
            Object.keys(swedishStats),'Frequency (%)', true);

        if (appState.fileIsSelected()) {
            cryptoStats = getTextLetterFrequencySwe(cryptoText);
        }
    } else if (language === "en") {

        plotGraph('#language-stats-area',englishGraphData,'English letter statistics','column',
            Object.keys(englishStats),'Frequency (%)', true);

        if (appState.fileIsSelected()) {
            cryptoStats = getTextLetterFrequencyEng(cryptoText);
        }
    }
    var categories = "";
    setCryptoGraphData(language, cryptoStats);
    if (appState.fileIsSelected()) {
        categories = Object.keys(cryptoStats);
    }
    plotGraph('#crypto-stats-area',cryptoGraphData, 'Loaded text letter statistics','column',
        categories,'Occurrences', true, "No file loaded");

};

/**
 * Initializes the language statistics charts.
 */
var initStatChartsMngr = function() {
    document.body.addEventListener('languageChange', function(_) {
        plotGraphs(appState.getLang());
    });
    document.body.addEventListener('fileChange', function(_) {
        plotGraphs(appState.getLang());
    });

    plotGraphs(appState.getLang());
};
