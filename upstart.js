var hogan = require('hogan')
	, unix = require('./unix')
require('shelljs/global')

/**
 * Adds a job to upstart, that does `npm start` in `documentroot` as `user`.
 * 
 * @param name
 * @param documentroot
 * @param user
 */
function addJob(name, documentroot, user) {
	var template = 
		'description "node app {{name}}"\n' + 
		'\n' +
		'start on started networking\n' +
		'stop on runlevel [016]\n' +
		'setuid {{user}}\n' +
		'\n' +
		'script\n' +
		'	cd \'{{cwd}}\'\n' +
		'	npm start\n' +
		'end script\n' +
		'\n' +
		'respawn\n' +
		''
		;

	var config = hogan.compile(template).render({
		name: name,
		cwd: documentroot,
		user: user
	});
	
	var file = '/etc/init/' + name + '.conf';
	unix.writefile(file, config);
}

/**
 * Removes the job for `appid` and `hostname` from upstart.
 * 
 * @param name
 */
function delJob(name) {
	var file = '/etc/init/' + name + '.conf';
	rm(file);	
}

/**
 * Reloads the given service.
 * @param service
 */
function reload(service) {
	exec('initctl reload ' + service);
}

/**
 * Starts the given service.
 * @param service
 */
function start(service) {
	exec('initctl start ' + service);
}

/**
 * Stops the given service.
 * @param service
 */
function stop(service) {
	exec('initctl stop ' + service);
}

module.exports = {
	addJob: addJob,
	delJob: delJob,
	reload: reload,
	start: start,
	stop: stop
}
