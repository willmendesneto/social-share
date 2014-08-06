/* globals require, module */
//
// OBS:
//  Replace the string with informations
//  <%= yeomanConfig.assets.css %> = Stylesheets folder
//  <%= yeomanConfig.assets.js %> = Scripts folder
//  <%= yeomanConfig.assets.img %> = Images folder
//  <%= yeomanConfig.assets.font %> = Fonts folder

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  'use strict';

  var LIVERELOAD_PORT = 35730;
  var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
  var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint:all'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['<%= yeoman.app %>/css/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/css/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/js/{,*/}*.js',
          '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/css/',
          src: '{,*/}*.css',
          dest: '.tmp/css/'
        }]
      }
    },
    connect: {
      options: {
        port: 9100,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://0.0.0.0:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'Gruntfile.js'
        ]
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/js/{,*/}*.js'
      ]
    },
    // not used since Uglify task does concat,
    // but still available if needed
    concat: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/js/{,*/}*.js',
            '<%= yeoman.dist %>/css/{,*/}*.css',
            '<%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/css/fonts/*'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/js/{,*/}*.js',
            '<%= yeoman.dist %>/css/{,*/}*.css',
            '<%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/css/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    //imagemin: {
    //  dist: {
    //    files: [{
    //      expand: true,
    //      cwd: '<%= yeoman.app %>/img',
    //      src: '{,*/}*.{png,jpg,jpeg}',
    //      dest: '<%= yeoman.dist %>/img'
    //    }]
    //  }
    //},
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/img',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/img'
        }]
      }
    },
    cssmin: {
      // By default, your `index.html` <!-- Usemin Block --> will take care of
      // minification. This option is pre-configured if you do not wish to use
      // Usemin blocks.
      dist: {
        files: {
          '<%= yeoman.dist %>/css/main.min.css': [
            '.tmp/css/{,*/}*.css',
            '<%= yeoman.app %>/css/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    bower: {
      install: {
        verbose: true,
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,php,png,txt}',
            '.htaccess',
            'img/{,*/}*.{gif,webp}',
            'css/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/img',
          dest: '<%= yeoman.dist %>/img',
          src: [
            'generated/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/css',
        dest: '.tmp/css/',
        src: '{,*/}*.css'
      }
    },
    concurrent: {
      server: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        //'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/js/scripts.js': [
            '<%= yeoman.dist %>/js/scripts.js'
          ]
        }
      }
    },
    htmllint: {
      app: ['<%= yeoman.app %>/*.html'],
      dist: ['<%= yeoman.dist %>/*.html']
    },
    rsync: {
      options: {
        args: ['--verbose'],
        exclude: ['.git*','*.scss','node_modules'],
        recursive: true
      },
      prod: {
        options: {
          src: '<%= yeoman.dist %>/',
          dest: '/home/linguagil/linguagil.com.br/',
          host: 'linguagil@linguagil.com.br',
          syncDestIgnoreExcl: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-html');
  grunt.loadNpmTasks('grunt-rsync');

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'jshint',
    'htmllint:app',
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    //'cdnify',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('deploy', [
    'rsync:prod'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
