// PLUGIN_NAME: gulp-asciidoctor
var through = require('through-gulp');
var gutil = require('gulp-util');
var asciidoctorJs = require('asciidoctor.js')();
var opal = asciidoctorJs.Opal;
var processor = asciidoctorJs.Asciidoctor(true);

module.exports = function (options) {

    var options = options || {};
    var asciidoctorOptions = {};

    // default config
    asciidoctorOptions.base_dir = options.base_dir || process.cwd();
    asciidoctorOptions.safe = options.safe || 'secured';
    asciidoctorOptions.doctype = options.doctype || 'article'; //book,inline
    asciidoctorOptions.attributes = options.attributes || ['showtitle'];
    asciidoctorOptions.header_footer = (options.header_footer === undefined ?
        true : options.header_footer);

    var optionsOpal = opal.hash2(
        ['base_dir', 'safe', 'doctype', 'header_footer', 'attributes'],
        asciidoctorOptions);


    // creating a stream through which each file will pass
    var stream = through(function (file, encoding, callback) {
        // do whatever necessary to process the file
        if (file.isNull()) {
            callback(null, file);
            return;
        }

        if (file.isStream()) {
            callback(new gutil.PluginError('gulp-asciidoctor',
                'Streaming not supported'));
            return;
        }

        if (file.isBuffer()) {

        }

        // just pipe data next, or just do nothing to process file later in flushFunction
        // never forget callback to indicate that the file has been processed.

        var data = processor.$convert(file.contents.toString(),
            optionsOpal);

        file.contents = new Buffer(data);
        file.path = gutil.replaceExtension(file.path, '.html');

        callback(null, file);

    }, function (callback) {
        // just pipe data next, just callback to indicate that the stream's over
        // this.push(something);
        callback();
    });

    // returning the file stream
    return stream;
};
