// Media files are dropped into public/media/ by hand (see public/media/README.md).
// Components render only what exists, so a missing file produces an empty
// frame instead of a broken image. Build-time only (node:fs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

/** True when `/media/x.jpg` (site-relative) exists under public/. */
export const mediaExists = (src: string): boolean => fs.existsSync(path.join(publicDir, src));
