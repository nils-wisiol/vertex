var unix = require('./unix')
	, nginx = require('./nginx')
	, upstart = require('./upstart')
require('shelljs/global')

/**
 * Adds a new node application to the server configuration.
 * @param config Object containing the configuration of the node:
 *   {
 *     hostname: 'mynode.example.com',
 *     git: 'https://github.com/John-Doe/example-repo.git'
 *   }
 */
function addNode(config) {
	// Adding a node application to the server consists of serveral steps.
	// The steps are organized in blocks, numbered from 000-999. Each block
	// has it's counterpart in delNode to make sure a node can be completely
	// deleted. Blocks are marked with "////" at the beginning.
	
	//// 000 Set up further configuration
	// this block only contains actions that do not need to be undone
	config.appid = Math.random().toString(36).substring(7); // TODO replace with better random generator
	config.documentroot = '/var/www/' + config.appid;
	config.unixuser = config.appid;
	config.shell = '/bin/false';
	config.upstart = config.appid + '+' + config.hostname;
	
	//// 100 Create directory for app
	mkdir(config.documentroot); // TODO set access rights
	
	//// 200 Add UNIX user
	unix.useradd(config.unixuser, config.documentroot, config.shell);
	config.port = config.unixid + 10000;
	
	//// 300 Create nginx server block
	nginx.addRevProxy(config.appid, config.hostname, config.port);
	
	//// 400 git clone / deployment
	cd(config.documentroot);
	exec('git clone \'' + config.git + '\' .'); // TODO only newest revision TODO correct branch TODO authentication TODO compiliation and deployment
	
	//// 500 Create upstart job
	upstart.addJob(config.upstart, config.documentroot, config.unixuser);
	
	//// 600 Refresh nginx config
	upstart.reload('nginx');
	
	//// 700 start upstart job
	upstart.start(config.upstart);

	// save config to database
	
	return config;
}

/**
 * Deletes the node application identified by `id` from the server.
 * @param id Identifier for the application to be removed. // TODO
 */
function delNode(config) {
	// Undo everything that addNode did
	
	//// 700 start upstart job
	upstart.stop(config.upstart);
	
	//// 600 Refresh nginx config
	// nothing to do
	
	//// 500 Create upstart job
	upstart.delJob(config.upstart);
	
	//// 400 git clone / deployment
	rm('-r', config.documentroot + '/*');
	rm('-r', config.documentroot + '/.*');

	//// 300 Create nginx server block
	nginx.delRevProxy(config.appid, config.hostname);
	
	//// 200 Add UNIX user
	unix.userdel(config.unixuser);
	
	//// 100 Create directory for app
	rm('-r', config.documentroot);

	//// 000 Set up further configuration
	// this block only contains actions that do not need to be reversed
	
	// remove config from database
	return;
}

var c = {
	hostname: 'tlsa-generator.dens-online.net',
	git: 'https://github.com/nils-wisiol/tlsa-generator'
};

c = addNode(c);
console.log();
console.log('######################################################################');
console.log();
//console.log(c);
delNode(c);
