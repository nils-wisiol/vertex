require('shelljs/global')
var fs = require('fs')

/**
 * Adds a user to the UNIX system, using the useradd command
 * 
 * @param name
 * @param dir
 * @param shell
 */
function useradd(name, dir, shell) {
	exec('useradd \'' + name + '\' -d \'' + dir + '\' -s \'' + shell + '\'');
	return 1337; // TODO
}

/**
 * Removes a user form the UNIX system, useing the userdel command
 * 
 * @param name
 */
function userdel(name) {
	return exec('userdel \'' + name + '\'');
}

/**
 * Write the content into a file at path.
 * @param path
 * @param content
 */
function writefile(path, content) {
	fs.writeFileSync(path, content);
}

// Export public functions
module.exports = {
	useradd: useradd,
	userdel: userdel,
	writefile: writefile
}
