import { existsSync, mkdirSync } from "node:fs";

export function ensureDir(dir: string) {
	if (!existsSync(dir)) { mkdirSync(dir, { recursive: true }); }
}