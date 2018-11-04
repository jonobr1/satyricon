/**
 * Apply missing glyphs with a specified Character Style.
 * @author jonobr1 / http://jonobr1.com
 * Based on Peter Kahrel's method -- www.kahrel.plus.com
 * Which is based on Peter Baumgartner's method, see http://forums.adobe.com/thread/1037284?tstart=0
 */

if (parseInt (app.version) < 6) {
	alert ('This script requires InDesign CS4 or later.');
	exit();
}

if (app.documents.length > 0) {
	main ();
}

function main () {
	var data = get_data();
	replace_missing_glyphs(data.styleName);
}

function replace_missing_glyphs (replacement_styles) {

	var j;
	var found;
	var errormsg = '';
	var docFonts = app.activeDocument.fonts.everyItem().getElements();

	app.findGlyphPreferences = null;
	var selectedStyles = app.activeDocument.characterStyles.item(replacement_styles);
	for (var i = 0; i < docFonts.length; i++) {
		if (docFonts[i].status == FontStatus.INSTALLED) {
			app.findGlyphPreferences.glyphID = 0;
			app.findGlyphPreferences.appliedFont = docFonts[i].fontFamily;
			app.findGlyphPreferences.fontStyle = docFonts[i].fontStyleName;
			found = app.activeDocument.findGlyph ();
			for (j = 0; j < found.length; j++) {
				found[j].applyCharacterStyle(selectedStyles);
			}
		} else {
			errormsg += docFonts[i].fontFamily + '\r';
		}
	}
	if (errormsg.length > 1) {
		errormsg = 'The following fonts are not installed\r(or have an illegal font style specified)\rand were skipped:\r\r' + errormsg;
		alert (errormsg);
	}
}


function get_data () {

	var styleNames = findCharacterStyles();
	var w = new Window('dialog { text: "Missing Glyphs", properties: { closeButton: false } }');
	var main = w.add('panel { alignChildren: "left" }');
	var group = main.add('group');
	var replacefonts = group.add('statictext { text: "Replace missing glyphs with Character Style:" }');
	var replacement_styles = group.add('dropdownlist', undefined, styleNames);
	var buttons = w.add('group { alignment: "right" }');

	buttons.add('button { text: "OK", name: "ok" }');
	buttons.add('button { text: "Cancel", name: "cancel" }');

	replacement_styles.onChange = function () {
		replacefonts.value = 1
	};

	var defaultCharacterStyles = replacement_styles.find ('[None]');
	if (defaultCharacterStyles != null) {
		replacement_styles.selection = defaultCharacterStyles;
	} else {
		replacement_styles.selection = 0;
	}

	replacefonts.value = 0;
	replacement_styles.active = true;
	current = replacement_styles.selection.text;

	var i, buffer = "";
	replacement_styles.onActivate = function () {
		buffer = "";
		current = replacement_styles.selection.text
	};

	replacement_styles.addEventListener("keydown", function (k) {
		if (k.keyName == "Backspace") {
			buffer = buffer.replace (/.$/, "");
			if (buffer.length == 0) {
				buffer = current;
			}
		} else {
			buffer += k.keyName.toLowerCase();
		}
		i = 0;
		while (i < styleNames.length - 1 && styleNames[i].toLowerCase().indexOf(buffer) != 0) {
			++i;
		}
		if (styleNames[i].toLowerCase().indexOf (buffer) == 0) {
			replacement_styles.selection = i;
		}
	});

	if (w.show() == 2) {
		exit();
	}

	return {
		styleName: replacement_styles.selection.text
	};
}



function findCharacterStyles() {
	var known = {},
			styles = [],
			styleName = app.activeDocument.characterStyles.everyItem().name;

	for (var i = 0; i < styleName.length; i++) {
		if (!known[styleName[i]]) {
			known[styleName[i]] = true;
			styles.push(styleName[i]);
		}
	}
	return styles;
}
