var hogan = require('hogan')
	, unix = require('./unix')
	, fs = require('fs')
require('shelljs/global')

/**
 * Adds a job to upstart, that does `npm start` in `documentroot` as `user`.
 */
function addJob(name, documentroot, user, userid, appid, hostname) {
	var template = fs.readFileSync('./upstart-job.conf.templ');

	var config = hogan.compile(template).render({
		name: name,
		documentroot: documentroot,
		user: user,
		appid: appid,
		hostname: hostname,
		ip: '10.0.' + userid.substr(0,2) + '.' + userid.substr(2),
		router: '10.1.' + userid.substr(0,2) + '.' + userid.substr(2)
	});
	
	var file = '/etc/init/' + name + '.conf';
	unix.writefile(file, config);
	// TODO use init-checkconf to check syntax
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
