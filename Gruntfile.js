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
		docma: {
			options: {
				config: {
					jsdoc: {
						sort: false
					}
				}
			},
			local: {
				options: {
					config: {
						app: {
							title: 'Local Documentation'
						}
					}
				},
				debug: true,
				src: [
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
					'src/polyfills.js'
				],
				dest: './docs'
			},
			all: {
				options: {
					config: {
						app: {
							title: 'DL_ Documentation',
							base: '/web-utilities',
							server: 'github'
						},
						template: {
							options: {
								navbar: true,
								navItems: [
									{
										label: "Documentation",
										href: "#",
										iconClass: "ico-book"
									},
									{
										label: "Download",
										iconClass: "ico-md ico-download",
										items: [
											{
												label: "v1.0.0",
												href: "https://github.com/CyanLetter/web-utilities/releases/download/1.0.0/utilities.min.js"
											}
										]
									},
									{
										label: "GitHub",
										href: "https://github.com/CyanLetter/web-utilities/",
										target: "_blank",
										iconClass: "ico-md ico-github"
									}
								]
							}
						}
					}
				},
				debug: false,
				src: [
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
					'src/polyfills.js'
				],
				dest: './docs'
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
						coverage: 'coverage/coverage.json',
						report: [
							{type: 'lcov', options: {dir: 'coverage/lcov'}},
							{type: 'text-summary'}
						],
						files: '<%= jasmine.all.src %>'
					}
				}
			}
		},
		codeclimate: {
			main: {
				options: {
					file: 'coverage/lcov/lcov.info',
					token: 'd95820f6b0a57160db67284f73308ddfe256c6ed046e30bc607889634b92d873',
					executable: 'node_modules/.bin/codeclimate-test-reporter'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-codeclimate-reporter');
	grunt.loadNpmTasks('grunt-docma');

	grunt.registerTask('default', ['concat', 'jshint:dist', 'uglify', 'docma:all']);
	grunt.registerTask('dev', ['concat', 'jshint:dist']);
	grunt.registerTask('build', ['concat', 'jshint:dist', 'uglify', 'docma:all']);
	grunt.registerTask('docs', ['docma:all']);
	grunt.registerTask('localdocs', ['docma:local']);
	grunt.registerTask('test', ['concat', 'jshint:dist', 'jasmine:all']);
	grunt.registerTask('test-coverage', ['concat', 'jshint:dist', 'jasmine:istanbul', 'codeclimate:main']);
};