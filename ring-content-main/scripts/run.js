const { fork } = require('child_process');
const { join } = require('path');

const options = require('./.config.js');

console.log(process.argv);

const projectName = (process.argv[2]);
const projectPath = join(options.packages, projectName);

const program = fork(projectPath, {
	env: process.env, stdio: 'inherit', detached: false,
	execArgv: [
		'--enable-source-maps',
	],
});

program.on('exit', (code) => {
	console.log('program exit with code', code);
	process.exit(code ?? 0);
});