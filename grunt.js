/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! Periphery.js - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://cfurrow.github.com/periphery.js\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Carl Furrow; Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'scripts/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>',
          'scripts/util.js',
          'scripts/shape/shape.js',
          'scripts/shape/rectangle.js',
          'scripts/shape/circle.js',
          'scripts/shape/movingCircle.js',
          'scripts/main.js'],
        dest: 'dist/periphery.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/periphery.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {}
  });

  // Default task.
  //grunt.registerTask('default', 'lint qunit concat min');
  grunt.registerTask('default', 'lint qunit concat min');

};
