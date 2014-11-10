'use strict';

var through = require('through');
var detector = require('detect-invalid-requires');
var path = require('path');
var mothership = require('mothership');

require('colors');

// Valid options (set in package.json under caseify)
// * relativePaths: default FALSE
// * throwOnError: default FALSE
function loadOptionsFromPackage() {
	var res = mothership.sync(
		process.cwd(), function ismothership (pack) {
		return !!(pack.caseify);
		}
	);
	return res && res.pack && res.pack.caseify ? res.pack.caseify : {};
}

module.exports = function (file) {
	var options = loadOptionsFromPackage();
	return through(function (data) {
		detector(file, {}, function (invalids) {
			var msg, fileRelOrAbs;
			if (invalids.length) {
				msg = invalids.map(function (invalid) {
					fileRelOrAbs = options.relativePaths ? path.relative(process.cwd(), invalid.file) : invalid.file;
					return 'Caseify - ' + fileRelOrAbs.yellow + ' module ' + invalid.path.red + ' not found in case-sensitive environment';
				}).join('\n');

				if (options.throwOnError) {
					throw new Error(msg);
				} else {
					console.log(msg);
				}
			}
			this.queue(data);
		}.bind(this));
	});
};
