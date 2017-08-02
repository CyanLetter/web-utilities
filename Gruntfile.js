module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! DL Web Utilities <%= pkg.version %> */\n'
			},
			build: {
				src: 'build/utilities.js',
				dest: 'build/utilities.min.js'
			}
		},
		jshint: {
			dist: ['build/utilities.js'],
			all: ['spec/**/*.js', 'build/utilities.js']
		},
		concat: {
			dist: {
				src: [
					'src/intro.js',
					'src/setup.js',
					'src/physics.js',
					'src/maths.js',
					'src/data-structures.js',
					'src/randomization.js',
					'src/parsing.js',
					'src/validation.js',
					'src/text-layout.js',
					'src/date-time.js',
					'src/asset-management.js',
					'src/polyfills.js',
					'src/outro.js'
				],
				dest: 'build/utilities.js',
				options: {
					separator: '\n\n'
				}
			}
		},
		jsdoc: {
			dist: {
				src: ['src/**/*.js', '!src/intro.js', '!src/outro.js'],
				options: {
					'destination': 'docs',
					'template' : "node_modules/ink-docstrap/template",
					'configure' : "jsdoc.conf.json"
				}
			}
		},
		jasmine: {
			all: {
				src : 'build/utilities.js',
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
			},
			istanbul: {
				src: '<%= jasmine.all.src %>',
				options: {
					vendor: '<%= jasmine.all.options.vendor %>',
					specs: '<%= jasmine.all.options.specs %>',
					page: '<%= jasmine.all.options.page %>',
					template: require('grunt-template-jasmine-istanbul'),
					templateOptions: {
						coverage: 'coverage/json/coverage.json',
						report: [
							{type: 'html', options: {dir: 'coverage/html'}},
							{type: 'text-summary'}
						]
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('default', ['concat', 'jshint:dist', 'uglify', 'jsdoc']);
	grunt.registerTask('dev', ['concat', 'jshint:dist']);
	grunt.registerTask('build', ['concat', 'jshint:dist', 'uglify', 'jsdoc']);
	grunt.registerTask('test', ['concat', 'jshint:dist', 'jasmine:all']);
	grunt.registerTask('coverage', ['concat', 'jshint:dist', 'jasmine:istanbul']);
};