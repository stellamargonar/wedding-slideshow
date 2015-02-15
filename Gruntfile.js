'use strict';
module.exports = function (grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-istanbul');
  
    grunt.initConfig({

        // Declare enviroment for instrumented code, thus coverage stage
        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: '../coverage/instrument/lib/'
            }
        },

        clean: {
            coverage: {
                src: ['coverage/reports']
            }
        },

        instrument: {
            files: 'app/lib/*.js',
            options: {
                lazy: false,
                basePath: 'coverage/instrument/'
            }
        },

        storeCoverage: {
            options: {
                dir: 'coverage/reports/'
            }
        },


        makeReport: {
            src: 'coverage/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: 'coverage/reports',
                print: 'detail'
            }
        },
        coffee : {
            compile : {
                options: {
                    flatten: true,
                    expand: true
                },
                files: {
                    'app/lib/requestHandlers.js': ['app/src/requestHandlers.coffee'],
                    'app/lib/server.js'         : ['app/src/server.coffee']
                }      
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                    src: ['Gruntfile.js']
            },
            js: {
                src: ['app/*.js']
            },
            coffee : {
                src : ['app/src/*.coffee']
            },
            test: {
                src: ['app/test/*.js']
            }
        },

        mochacli: {
            options: {
                reporter: 'spec',
                bail: true
            },
            all: ['app/test/*.js']
        },

        mochaTest : {
            options: {
                reporter: 'spec'
            },
            src: ['app/test/*.js']
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: '<%= jshint.js.src %>',
                tasks: ['jshint:js', 'mochacli']
            },
            coffee: {
                files: '<%= jshint.coffee.src %>',
                tasks: ['coffee', 'jshint:js', 'mochacli']
            },

            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'mochacli']
            }
        }
    });

    grunt.registerTask('default', ['coffee', 'jshint:js', 'mochacli']);
    grunt.registerTask('coverage', 
        ['coffee', 'jshint:js', 'env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport'
        ]
    );
};
