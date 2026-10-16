export const BYTES_MO = 1024*1024;

/**
 * 
 * @param bytes size in bytes
 * @param max max size in mo
 * @returns true if the size is bellow the max limit
 */
export const SizeLimit = (bytes: number, max: number = 8) => {
	const mo = (Number.isNaN(bytes) ? 16 : bytes) / BYTES_MO
	const limit = !!(mo <= max);
	return limit;
};
