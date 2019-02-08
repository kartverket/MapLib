module.exports = function ( grunt ) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-karma');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        /*' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +*/
        ' */\n'
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          "package.json"
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          "package.json"
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= build_dir %>'
    ],

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_vendor_assets: {
        files: [
          {
            src: [ '<%= vendor_files.assets %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true,
            flatten: true
          }
       ]
      },
      build_appjs: {
          files: [
              {
                  src: [ '<%= app_files.js %>' ],
                  dest: '<%= build_dir %>/',
                  cwd: '.',
                  expand: true
              }
          ]
      },
      build_leaflet_appjs: {
          files: [
              {
                  src: [ '<%= app_leaflet_files.js %>' ],
                  dest: '<%= build_dir %>/',
                  cwd: '.',
                  expand: true
              }
          ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_leaflet_vendorjs: {
          files: [
              {
                  src: [ '<%= vendor_leaflet_files.js %>' ],
                  dest: '<%= build_dir %>/',
                  cwd: '.',
                  expand: true
              }
          ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**', '!karma*.js' ],
            dest: '<%= compile_dir %>',
            cwd: '<%= build_dir %>',
            expand: true
          }
        ]
      },
      deployToLocal: {
        files: [
          {
            src: [ '<%= compile_dir %>/**' ],
            dest: '<%= localDeployDir %>',
            cwd: '.',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `build_css` target concatenates vendor CSS.
       */
      build_css: {
        src: [
          '<%= vendor_files.css %>'
        ],
        dest: '<%= build_dir %>/<%= pkg.name %>.css'
      },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
          options: {
              banner: '<%= meta.banner %>'
          },
          src: [
              'module.prefix',
              '<%= build_dir %>/src/**/*.js',
              'module.suffix'
          ],
          dest: '<%= compile_dir %>/<%= pkg.name %>.js'
      },
      compile_leaflet_js: {
          options: {
              banner: '<%= meta.banner %>'
          },
          src: [
              /*'<%= vendor_leaflet_files.js %>',*/
              'module.prefix',
              '<%= build_dir %>/src/**/*.js',
              'module.suffix'
          ],
          dest: '<%= compile_dir %>/<%= pkg.name %>_leaflet.js'
      },
      create_minified: {
        src: [
          '<%= compile_dir %>/<%= pkg.name %>.js'
        ],
        dest: '<%= compile_dir %>/<%= pkg.name %>-min.js'
      },
        create_leaflet_minified: {
          src: [
              '<%= compile_dir %>/<%= pkg.name %>_leaflet.js'
          ],
          dest: '<%= compile_dir %>/<%= pkg.name %>_leaflet-min.js'
      }
    },
    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      },
      minified:{
        files: {
          '<%= concat.create_minified.dest %>': '<%= concat.create_minified.dest %>'
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: { // http://www.jshint.com/docs/options/
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        noempty: true,
        sub: true,
        boss: false,
        eqnull: true,
        bitwise: true,
        strict: false,
        undef: false,
        unused: true
      },
      globals: {}
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= build_dir %>/<%= pkg.name %>.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= vendor_files.css %>',
          '<%= build_dir %>/<%= pkg.name %>.css'
        ]
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= test_files.js %>'
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:src', 'karma:unit:run', 'copy:build_appjs' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets', 'copy:build_vendor_fonts' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= app_files.atpl %>',
          '<%= app_files.ctpl %>'
        ],
        tasks: [ ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      sass: {
        files: [ 'src/**/*.scss' ],
        tasks: [ 'concat:build_css' ]
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build', 'karma:unit', 'delta' ] );

    /**
     * The default task is to build and compile.
     */
    grunt.registerTask( 'default', [ 'build', 'compile' ] );

    /**
     * The default task is to build and compile.
     */
    grunt.registerTask( 'leaflet_default', [ 'leaflet_build', 'leaflet_compile' ] );

    /**
     * The `build` task gets your app ready to run for development and testing.
     */
    grunt.registerTask( 'build', [
        'clean', 'jshint', /*'concat:build_css',*/ 'copy:build_vendor_assets',
        'copy:build_appjs', 'copy:build_vendorjs', 'karmaconfig', 'karma:continuous'
    ]);

    /**
     * The `build` task gets your app ready to run for development and testing.
     */
    grunt.registerTask( 'leaflet_build', [
        'clean', 'jshint', /*'concat:build_css',*/ 'copy:build_vendor_assets',
        'copy:build_leaflet_appjs', 'copy:build_leaflet_vendorjs', 'karmaconfig', 'karma:continuous'
    ]);

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     */
    grunt.registerTask( 'leaflet_compile', [
        'copy:compile_assets', 'concat:compile_leaflet_js', 'concat:create_leaflet_minified', 'uglify:minified'
    ]);

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     */
    grunt.registerTask( 'compile', [
        'copy:compile_assets', 'concat:compile_js', 'concat:create_minified', 'uglify:minified'
    ]);

    grunt.registerTask( 'deployToLocal', ['default', 'copy:deployToLocal']);

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );

    grunt.file.copy( 'karma/karma-unit.tpl.js', grunt.config( 'build_dir' ) + '/karma-unit.js', {
      process: function ( contents ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });

    grunt.file.copy( 'karma/karma-ci.tpl.js', grunt.config( 'build_dir' ) + '/karma-ci.js', {
        process: function ( contents ) {
            return grunt.template.process( contents, {
                data: {
                    scripts: jsFiles
                }
            });
        }
    });
  });
};
