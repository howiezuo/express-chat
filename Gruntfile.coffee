module.exports = (grunt) ->
	grunt.initConfig 
		pkg: grunt.file.readJSON 'package.json'
		coffee:
			compile:
				files:
					'public/javascripts/chatApp.js': 'public/coffeescripts/chatApp.coffee'
		watch:
			scripts:
				files: 'public/coffeescripts/*.coffee'
				tasks: ['coffee']

	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'

	grunt.registerTask 'default', ['watch', 'coffee']

	return