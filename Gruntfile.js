module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! DL Web Utilities <%= pkg.version %> */\n'
			},
			build: {
				src: 'src/utilities.js',
				dest: 'build/utilities.min.js'
			}
		},
		jshint: {
			source: ['src/**/*.js'],
			all: ['spec/**/*.js', 'src/**/*.js']
		},
		jasmine: {
			src : 'src/**/*.js',
			options : {
				specs : 'spec/**/*.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.registerTask('default', ['jshint:all', 'uglify']);
	grunt.registerTask('build', ['jshint:all', 'uglify']);
	grunt.registerTask('test', ['jshint:all', 'jasmine']);
};