// CTF writeup data. While this is empty the writeups section is not rendered at all.
// To add a writeup, push an object with the shape below and the section will appear.

export interface Writeup {
  title: string;
  event: string; // CTF/event name
  category: 'web' | 'pwn' | 'crypto' | 'rev' | 'misc' | 'forensics';
  date: string; // ISO YYYY-MM-DD
  href: string; // link to writeup (internal route or external)
  summary: string;
}

export const writeups: Writeup[] = [];
