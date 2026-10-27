// Media files are dropped into public/media/ by hand (see public/media/README.md).
// Components render only what exists, so a missing photo produces nothing
// instead of a broken image. Build-time only (node:fs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

/** True when `/media/x.jpg` (site-relative) exists under public/. */
export const mediaExists = (src: string): boolean => fs.existsSync(path.join(publicDir, src));

/** Keep only the items whose file exists, preserving the original index (alt texts are indexed). */
export function availableMedia<T extends { src: string }>(media: T[] | undefined): { m: T; i: number }[] {
  return (media ?? []).map((m, i) => ({ m, i })).filter(({ m }) => mediaExists(m.src));
}
