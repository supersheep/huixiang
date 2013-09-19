module.exports = function(grunt){

    grunt.initConfig({
        pkg:grunt.file.readJSON("package.json"),
        jshint: {
            options:{
                globals:{
                    "DP":true,
                    "$":true
                },
                asi:true,
                laxbreak:true,
                laxcomma:true,
                expr:true
            },
            all: ['Gruntfile.js','js/mod/*.js']
        },
        stylus:{
            options:{
                compress:false
            },
            compile: {
                files:[{expand: true, flatten:true, src:["stylus/*.styl"], dest:"css/",ext:".css"}]
            }
        },
        watch:{
            styl: {
              files: ['stylus/**/*.styl'],
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
};