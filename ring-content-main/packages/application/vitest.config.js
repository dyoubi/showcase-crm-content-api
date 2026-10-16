import { defineConfig } from 'vitest/config';


export default defineConfig({
	test: {
		reporters: ['default', 'junit'],
		coverage: {
			provider: 'istanbul' // or 'v8'
		}
	},
});