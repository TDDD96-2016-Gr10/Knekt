/* Hashcode.js 1.0.2 | https://github.com/stuartbannerman/hashcode | MIT license */
(function(a){a.Hashcode=(function(){var d=function(e){var e=e.toString(),g=0,f;for(f=0;f<e.length;f++){g=(((g<<5)-g)+e.charCodeAt(f))&4294967295}return g};var b=function(g){var e=0;for(var f in g){if(g.hasOwnProperty(f)){e+=d(f+c(g[f]))}}return e};var c=function(g){var e={string:d,number:d,"boolean":d,object:b};var f=typeof g;return g!=null&&e[f]?e[f](g)+d(f):0};return{value:c}})()})(window);
