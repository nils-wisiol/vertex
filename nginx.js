var hogan = require('hogan')
	, unix = require('./unix')
require('shelljs/global')

/**
 * Adds a reverse proxy to nginx configuration that forwards traffic
 * with Host: `hostname` to localhost:`port`.
 * 
 * @param appid Identifies the app this forwarding is for. Only used for config file name. 
 * @param hostname The hostname that is used to identify traffic for this app.
 */
function addRevProxy(appid, hostname) {
	var template = 
		'server {\n' + 
		'	listen 80;\n' +
		'	\n' +
		'	server_name {{hostname}};\n' +
		'	\n' +
		'	location / {\n' +
		'		proxy_pass http://localhost:0;\n' +
		'		proxy_http_version 1.1;\n' +
		'		proxy_set_header Upgrade $http_upgrade;\n' +
		'		proxy_set_header Connection \'upgrade\';\n' +
		'		proxy_set_header Host $host;\n' +
		'		proxy_cache_bypass $http_upgrade;\n' +
		'	}\n' +
		'}\n'
		;

	var config = hogan.compile(template).render({
		hostname: hostname
	});
	
	var file = '/etc/nginx/conf.d/' + hostname + '+' + appid + '.conf';
	unix.writefile(file, config);
}

/**
 * Removes a reverse proxy configuration from nginx.
 * 
 * @param appid Identifies the app this forwarding is for. Only used for config file name.
 * @param hostname The hostname that is used to identify traffic for this app.
 */
function delRevProxy(appid, hostname) {
	var file = '/etc/nginx/conf.d/' + hostname + '+' + appid + '.conf';
	rm(file);	
}

module.exports = {
	addRevProxy: addRevProxy,
	delRevProxy: delRevProxy
}
