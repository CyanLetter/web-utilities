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
				specs : 'spec/**/*.js',
				page: {
					settings: {
						userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1'
					}
				},
				vendor: [
					"https://code.jquery.com/jquery-3.1.0.min.js"
				]
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