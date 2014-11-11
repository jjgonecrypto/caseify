'use strict';

var through = require('through');
var detector = require('detect-invalid-requires');
var path = require('path');
var mothership = require('mothership');

require('colors');

// Valid options (set in package.json under caseify)
// * relativePaths: default FALSE
// * throwOnError: default FALSE
function loadOptionsFromPackage(file) {
	var res = mothership.sync(file, function ismothership (pack) {
		return !!(pack.caseify);
	});
	return res && res.pack && res.pack.caseify ? res.pack.caseify : {};
}

module.exports = function (file) {
	var options = loadOptionsFromPackage(file);
	return through(function (data) {
		this.pause();
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
					this.emit('error', msg);
				}
			}
			this.resume();
		}.bind(this));
		this.queue(data);
	});
};
