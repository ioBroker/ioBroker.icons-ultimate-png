// To use this file in WebStorm, right click on the file name in the Project Panel (normally left) and select "Open Grunt Console"

/** @namespace __dirname */
/* jshint -W097 */// jshint strict:false
/*jslint node: true */
"use strict";

module.exports = function (grunt) {
    var httpSrcPath = 'https://github.com/google/material-design-icons/tarball/master';
    var prefix      = "https://raw.githubusercontent.com/google/material-design-icons/master/";
    var imgSrcPath  = 'google-material-design-icons-*/*/2x_web/*.png';

    // Project configuration.
    grunt.initConfig({
        clean: {
            all: ['www/*.svg', 'www/*.png', 'www/*.jpg', '.build']
        },
        copy: {
            icons: {
                files: [
                    {
                        expand: true,
                        cwd: __dirname + '/.build/icons/',
                        src: [imgSrcPath],
                        dest: __dirname + '/www',
                        rename: function (dest, src) {
                            var parts = src.replace(/\\/g, '/').split('/');
                            return __dirname + '/www/' + parts[parts.length - 3] + '/' + parts[parts.length - 1];
                        }
                    }
                ]
            }
        },
        curl: {
            '.build/icons.tar.gz': httpSrcPath
        },
        targz: {
            icons: {
                files: {
                    ".build/icons":  ".build/icons.tar.gz"
                }
            }
        }
    });

    grunt.registerTask('updateList', function () {
        var fs = require('fs');
        //var dir = fs.readdirSync(__dirname + '/www');
        var readme = '';
        var html = '<html><body style=""><table>';
        var htmlLineImg = '<tr>';
        var htmlLineName = '<tr>';
        var inLine = 10;
        var cur = 0;




        for (var i = 1; i < 1001; i++) {
            if (cur && (!(cur % inLine))) {
                html += htmlLineImg + '</tr>';
                html += htmlLineName + '</tr>';
                htmlLineImg  = '<tr>';
                htmlLineName = '<tr>';
                cur = 0;
            }
            //readme += '![' + dir[i] + '](www/' + dir[i] + ')\n';
            readme += '![' + i + '.png](' + prefix + i + '.png)\n';

            htmlLineImg  += '<td style="text-align: center"><img src="' + i + '.png" width="64" height="64"></td>\n';
            htmlLineName += '<td style="text-align: center">' + i + '.png</td>\n';
            cur++;
        }
        html += htmlLineImg + '</tr>';
        html += htmlLineName + '</tr>';
        html += '</table></body></html>';
        grunt.file.write('ICONLIST.md', readme);
        grunt.file.write('www/index.html', html);
    });

    grunt.registerTask('default', [
        'updateList'
    ]);
};