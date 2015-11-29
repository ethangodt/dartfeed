module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
          src: [
            "client/lib/underscore/underscore.js",
            "client/lib/angular/angular.js",
            "client/lib/angular-route/angular-route.js",
            "client/app/**/*.js",
          ],
          dest: 'client/dist/script.js'
      }
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },
    uglify: {
      dist: {
          src: ['client/dist/script.js'],
          dest: 'client/dist/script.min.js'
      },
    },
    cssmin: {
      dist: {
        src:['client/styles/style.css'],
        dest: 'client/dist/style.min.css'
      }
    },

    clean: {
      dist: ['client/dist/*']
    },

    watch: {
      scripts: {
        files: [
          'client/**/*.js',
          'client/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'client/styles/style.css',
        tasks: ['cssmin']
      }
    },

    jshint: {
      files: [
        "client/app/services/services.js",
        "client/app/feed/testData.js",
        "client/app/user/user.js",
        "client/app/newUserPage/newUserPage.js",
        "client/app/app.js"
      ],
      options: {
        force: 'true',
        jshintrc: '_.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },
    shell: {
      mongodb: {
        command: 'mongod -dbpath ./data/db --fork --logpath ./mongod.log',
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('build', ['jshint', 'clean', 'concat', 'cssmin']);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['server-dev']);
      // add your production server task here
    } else {
      grunt.task.run(['server-dev']);
    }
  });

  grunt.registerTask('deploy', ['build', 'shell', 'upload']);


};
