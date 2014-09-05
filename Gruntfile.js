module.exports = function(grunt) {
	
	grunt.initConfig({
		debian_package: {
			dist: {
				options: {
					maintainer: {
						name: "Nils Wisiol",
						email: "mail@nils-wisiol.de"
					},
					prefix: "",
					name: "vertex",
					postfix: "",
					short_description: "Vertex NodeJS Server Manager",
					long_description: "Manage NodeJS Javascript applications hosting on your server.",
					version: "0.0.1",
					build_number: "1",
					links: [],
					directories: [
						'/opt/vertex',
						'/etc/init'
					]
				},
				files: [
					{
						expand: true,
						cwd: '.',
						src: [
							'**/*.js',
							'**/*.json',
							'**/*.tmpl',
							'node_modules/**/*.*'
						],
						dest: '/opt/vertex/'
					},
					{
						src: ['config/upstream/vertex.conf'],
						dest: '/etc/init/vertex.conf'
					},
					{
						src: ['config/nginx/vertex.conf'],
						dest: '/etc/nginx/conf.d/vertex.conf'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-debian-package');
}
