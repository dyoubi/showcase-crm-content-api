const { spawn } = require('child_process');
const { join } = require('path');
const { readdirSync } = require('fs');

const options = require('./.config.js');

const programs = {};

const directories = readdirSync(join(options.packages), { recursive: false, withFileTypes: true })
	.filter(v => v.isDirectory());

for (const dir of directories) {
	const projectPath = join(dir.parentPath, dir.name);
	console.log(projectPath);
	
	const tsc = spawn(`tsc`, [
		'--project',
		projectPath,
		'--watch',
	]);
	programs[dir.name] = tsc;

	tsc.stdout.on('data', (data) => {
		const msg = String(data).trim();
		if (msg.endsWith('Watching for file changes.')) {
			console.log(`[${dir.name}]:\n${msg}`);
		}
	});

	tsc.stderr.on('data', (data) => { console.error(`[${dir.name}]:\n${data}`); });
	tsc.on('close', (code) => { console.log(`[${dir.name}]:\nexited with code ${code}`); });
}