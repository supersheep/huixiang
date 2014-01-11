module.exports = function(grunt){

    grunt.initConfig({
        pkg:grunt.file.readJSON("package.json"),
        jshint: {
            options:{
                globals:{
                    "$":true
                },
                asi:true,
                laxbreak:true,
                laxcomma:true,
                expr:true
            },
            all: ['static/Gruntfile.js','static/js/mod/*.js']
        },
        stylus:{
            options:{
                compress:false
            },
            compile: {
                files:[{expand: true, flatten:true, src:["static/stylus/*.styl"], dest:"static/css/",ext:".css"}]
            }
        },
        watch:{
            styl: {
                files: ['static/stylus/**/*.styl'],
                tasks: ['stylus']
            },
            options: {
              nospawn: true
            }
        }
    });


    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-stylus");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default",["jshint","stylus"]);
    grunt.registerTask('heroku:production', 'jshint stylus');
};
