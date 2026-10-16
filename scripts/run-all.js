const { fork } = require('child_process');
const { join } = require('path');
const { readdirSync } = require('fs');

const options = require('./.config.js');

console.log(process.argv);

const directories = readdirSync(join(options.packages), { recursive: false, withFileTypes: true })
	.filter(v => v.isDirectory());

const programs = {};
for (const dir of directories) {
	const projectPath = join(dir.parentPath, dir.name);
	const program = fork(projectPath, {
		env: process.env, stdio: 'inherit', detached: false,
		execArgv: [
			'--enable-source-maps',
		],
	});
	program.on('exit', (code) => {
		console.log(`[${dir.name}]`, 'program exit with code', code);
		// process.exit(code ?? 0);
	});
	programs[dir.name] = program;
}

process.on('exit', (code) => {
	for (const k in programs) {
		if (programs[k]) {
			programs[k].kill(code)
		}
	}
})