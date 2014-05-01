'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // ---------------------------------------------------------------------- //
    watch: {
      code: {
        files: ['app/js/es6/**/*.js', 'app/js/es5/**/*.js', 'Gruntfile.js'],
        tasks: ['jshint:all', 'copy:es6', 'copy:es5', 'traceur']
      },
      jade: {
        files: ['app/**/*.jade'],
        tasks: ['jade:build']
      },
      less: {
        files: ['app/css/**/*.less'],
        tasks: ['less:build']
      },
      copyjs: {
        files: ['app/js/vendor/**/*.js'],
        tasks: ['copy:js']
      },
      copycss: {
        files: ['app/css/**/*.css'],
        tasks: ['copy:css']
      },
      copymedia: {
        files: ['app/media/**/*'],
        tasks: ['copy:media']
      }
    },
    // ---------------------------------------------------------------------- //
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'app/js/es6/**/*.js',
        'app/js/es5/**/*.js'
      ]
    },
    // ---------------------------------------------------------------------- //
    copy: {
      es6: {
        cwd: 'app/js/es6',
        src: ['**/*.js'],
        dest: 'public/js/es6',
        expand: true
      },
      es5: {
        cwd: 'app/js/es5',
        src: ['**/*.js'],
        dest: 'public/js/es5',
        expand: true
      },
      js: {
        cwd: 'app/js/vendor',
        src: ['**/*.js'],
        dest: 'public/js/vendor',
        expand: true
      },
      css: {
        cwd: 'app/css',
        src: ['**/*.css'],
        dest: 'public/css',
        expand: true
      },
      media: {
        cwd: 'app/media',
        src: ['**/*'],
        dest: 'public/media',
        expand: true
      }
    },
    // ---------------------------------------------------------------------- //
    jade: {
      build: {
        files: [{
          cwd: 'app',
          src: '**/*.jade',
          dest: 'public',
          ext: '.html',
          expand: true
        }]
      }
    },
    // ---------------------------------------------------------------------- //
    less: {
      build: {
        files: [{
          cwd: 'app/css',
          src: '**/*.less',
          dest: 'public/css',
          ext: '.css',
          expand: true
        }]
      }
    },
    // ---------------------------------------------------------------------- //
    clean: {
      server: 'public'
    },
    // ---------------------------------------------------------------------- //
    traceur: {
      build: {
        files: [{
          cwd: 'public/js/es6',
          src: '**/*.es6.js',
          dest: 'public/js/es6',
          ext: '.js',
          expand: true
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['clean', 'jshint:all', 'copy:es6', 'copy:es5', 'traceur', 'jade:build', 'less:build','copy:js', 'copy:css', 'copy:media']);
  grunt.registerTask('default', ['build', 'watch']);

  grunt.registerMultiTask('traceur', 'ES6 to ES5', function(){
    var exec  = require('child_process').exec;
    var cmd;

    this.files.forEach(function(f){
      cmd = './tools/traceur-compiler/traceur --sourcemap --experimental --out '+f.dest+' --script ' + f.src[0];
      console.log(cmd);

      exec(cmd, function(error, stdout, stderr){
        console.log(error);
        console.log(stdout);
        console.log(stderr);
      });
    });
  });
};
