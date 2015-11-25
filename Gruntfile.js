module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    concat: {
      options: {
        separator: ';',
      },
      dist: {
          src: ['client/**/*.js'],
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

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-clean');

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

  grunt.registerTask('build', ['clean', 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['server-dev']);
      // add your production server task here
    } else {
      grunt.task.run(['server-dev']);
    }
  });

  grunt.registerTask('deploy', ['build', 'upload']);


};
