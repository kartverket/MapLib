/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'dist',

  /**
   * localDeployDir is the directory to which the localDeployDir copy task copies the dist directory.
   * It is useful for testing out changes made to maplib before pushing it to the repository
   */
  localDeployDir: '../norgeskart3/build/vendor/maplib',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */


  app_files: {
      js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
      jsunit: [ 'src/**/*.spec.js' ],

      atpl: [ 'src/app/**/*.tpl.html' ],
      ctpl: [ 'src/common/**/*.tpl.html' ],

      html: [ ]
  },
    app_leaflet_files: {
        js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
        jsunit: [ 'src/**/*.spec.js' ],

        atpl: [ 'src/app/**/*.tpl.html' ],
        ctpl: [ 'src/common/**/*.tpl.html' ],

        html: [ ]
    },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
        'build/vendor/**/*.js',
        'src/ISY.Utils/*.js',
        'src/ISY.Events/*.js',
        'src/ISY.Facade/*.js',
        'src/ISY.MapAPI/Map/*.js',
        'src/ISY.MapAPI/Parsers/*.js',
        'src/ISY.MapAPI/Tools/*.js',
        'src/ISY.MapImplementation/OL3/*.js',
        'src/ISY.MapImplementation/OL3/Sources/*.js',
        'src/ISY.MapImplementation/OL3/Styles/*.js',
        'src/ISY.Domain/*.js',
        'src/ISY.Repository/*.js',
        'vendor/jasmine-ajax/lib/mock-ajax.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/jquery/dist/jquery.js',
      'vendor/openlayers3/ol.js',
      'vendor/xml2json/xml2json.js',
      'vendor/proj4/dist/proj4.js',
      'vendor/blob-util/dist/blob-util.min.js',
      'vendor/xml-to-json/xml.js',
      'vendor/xml-to-json/json2xml.js'
    ],
    css: [
      'vendor/openlayers3/ol.css'
    ],
    assets: [
    ],
    fonts: [
      'vendor/bootstrap/fonts/glyphicons-halflings-regular.woff',
      'vendor/bootstrap/fonts/glyphicons-halflings-regular.ttf'
    ]
  },
  vendor_leaflet_files: {
      js: [
          'vendor/jquery/dist/jquery.js',
          'vendor/leaflet/dist/leaflet.js',
          'vendor/xml2json/xml2json.js',
          'vendor/proj4/dist/proj4.js',
          'vendor/proj4leaflet/src/proj4leaflet.js',
          'vendor/leaflet/dist/leaflet.css',
          'vendor/leaflet/dist/images/layers.png',
          'vendor/leaflet/dist/images/layers-2x.png',
          'vendor/leaflet/dist/images/marker-icon.png',
          'vendor/leaflet/dist/images/marker-icon-2x.png',
          'vendor/leaflet/dist/images/marker-shadow.png',
          'src/assets/Leaflet.MousePosition/L.Control.MousePosition.js',
          'src/assets/Leaflet.MousePosition/L.Control.MousePosition.css'
      ],
      css: [
      ],
      assets: [
      ],
      fonts: [
          'vendor/bootstrap/fonts/glyphicons-halflings-regular.woff',
          'vendor/bootstrap/fonts/glyphicons-halflings-regular.ttf'
      ]
  }
};
