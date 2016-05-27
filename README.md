# Knekt

Knekt is an interactive web application inteded to be used as an aid
for teaching classical encryption methods and their weaknesses.

## Why is the application called Knekt?
Because Knekt is a pun on the Swedish word "knäckt", which translates into
cracked. This so happens to be exactly what the encrypted texts should be after
having faced this application coupled with your excellent decryption skills.

## Directory structure
### app/
The app/ directory is where you'll find the development code.
Subdirectories are:
  * *css* - For all CSS and SASS files.
  * *img* - For images such as logotypes and favicons.
  * *js* - For all project specific JS source code files.
  * *lib* - For external JS libraries.
  * *res* - Currently used to store the encrypted text files.
  * *test* - Unit test files.
 
### dist/
The dist/ directory holds deployment ready code. Use this in production.
The content of dist/ is similar to app/ with the following differences
per subdirectory:
  * *css* - SASS specific files (*.scss and *.css.map) are __not__ included.
  * *js* - Has a single file, knekt.min.js, which is an optimized and minified version of all the files in app/js.
  * *lib* - All files are the minified counterparts to the files in app/lib.

### docs/
This directory holds auto-generated documentation from the JSDoc
comments in the JavaScript source code. To read it, open docs/index.html
in any browser.

## Code style guidelines
Our ambition is to follow Google's style guides for [HTML/CSS][style1]
and [JavaScript][style2], with the exception that we use 4 space
indentation for JavaScript.
[style1]: http://google.github.io/styleguide/htmlcssguide.xml
[style2]: http://google.github.io/styleguide/javascriptguide.xml

## Libraries and dependencies

Knekt uses the following JavaScript libraries:
  * [jQuery](https://jquery.com/)
  * [Highcharts](http://www.highcharts.com/)
  * [Handlebars](http://handlebarsjs.com/)
  * [Dragula](http://bevacqua.github.io/dragula/)
  * [Hashcode](https://github.com/stuartbannerman/hashcode)
  
For unit testing we've used [Karma][] and [QUnit][].
[Karma]: http://karma-runner.github.io/0.13/index.html
[QUnit]: https://qunitjs.com/

## Building the application
Our build system minimizes/optimizes the JavaScript code and updates the index.html file.
The build system requires [Closure Compiler][compiler] and [HTML Tidy][tidy].
To generate a new build in the dist/ directory, run *make*. See the
[Makefile](Makefile) for further details.
[compiler]: https://developers.google.com/closure/compiler/
[tidy]: http://www.html-tidy.org/

## Contributors :frog:
- [Fredrik Bergstrand](https://github.com/fredrikbergstrand)
- Kimberley French
- Rebecka Geijer Michaeli
- [Eric Henziger](https://github.com/henziger)
- Oscar Johansson
- [Robert Kumpulainen](https://github.com/robrnen)
- Erik Rönmark
- Kristoffer Tennivaara
- [Victor Tranell](https://github.com/victortranell)

We want you to become a ~~cryptoad~~ contributor as well. Have a look at
[CONTRIBUTING.md](CONTRIBUTING.md) for instructions on how to proceed.

## License
Knekt is licensed under the MIT license. However, Knekt is distributed
with non-free components that permits non-commercial use. Remove
[Highcharts](https://highcharts.com) if you wish to use this software for
commercial purposes.

See [LICENSE](LICENSE.txt) for further details.
