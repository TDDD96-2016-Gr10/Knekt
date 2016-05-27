# Makefile for building Knekt.
# Assumes pwd is project_dir/
# Assumes Google Closure Compiler is installed via npm.
# TODO: Search through multiple paths for Closure Compiler to allow multiple ways of installation?
# author: Eric Henziger <erihe763@student.liu.se>

# Set NODE_PATH if not already set
NODE_PATH?=$(shell npm root -g)

build:

	# Generate dist/index.html
# Remove our JavaScript lines
	grep -v '.*<script src="js\/.*\.js"><\/script>.*$$' app/index.html > dist/index.html

	# Compile our JavaScript
	java -jar $(NODE_PATH)/google-closure-compiler/compiler.jar --js_output_file=dist/js/knekt.min.js 'app/js/**.js'

	# Add a script tag in index.html for our compiled code, just before '</head>'
	sed 's/<\/head>/\ \ <script src="js\/knekt.min.js"><\/script><\/head>/g' dist/index.html > tmp; mv tmp dist/index.html

	cp app/legal.html dist/legal.html

	# Copy CSS files to dist/css and resource files to dist/res
	cp app/favicon.ico dist/favicon.ico
	cp app/css/main.css dist/css/
	cp app/css/vendor/*.css dist/css/vendor/
	cp app/font/*.ttf dist/font/
	cp -r app/res/* dist/res/
	cp -r app/img/* dist/img/

# Cleanup dist/index.html with HTML Tidy
# tidy is buggy with Linux, finds false warnings and breaks the HTML.
# It works fine on OS X, but lets avoid cleanup for now.
	tidy -modify -quiet -indent -wrap 120 dist/index.html

docs:
	rm -rf docs/
	jsdoc -d docs app/js/

clean:
# Cleans pretty much everything in dist except the lib directory.
	rm dist/index.html
	rm dist/favicon.ico
	rm dist/css/main.css
	rm dist/css/vendor/*.css
	rm -rf dist/js/*
	rm -rf dist/res/*
	rm -rf dist/img/*

.PHONY:	clean docs
