module.exports = function(grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // uglify: {
        //     target: {
        //         files: {
        //             'build/core.min.js': ['src/core.js']
        //         }
        //     }
        // },
        compass: {
            style: {
                sassDir: 'sass',
                cssDir: 'build/css',
                assetCacheBuster: false,
                environment: 'production'
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'stylesheets/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/css/',
                ext: '.min.css'
            }
        },
        jshint: {
            all: ['build/*.js', 'src/core.js']
        },
        watch: {
            js: {
                files: ['src/core.js'],
                tasks: ['jshint']
            },
            sass: {
                files: ['sass/*.scss'],
                tasks: ['compass']
            },
            cssmin:{
                files:'stylesheets/*',
                tasks:['cssmin']
            }
        },
        
    });

    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-compass');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('default', ['watch']);

};