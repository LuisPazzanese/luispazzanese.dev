// Shared type for all translation files. Adding a new language is: copy en.ts,
// translate the strings, register the import in index.ts.
//
// Only UI chrome lives here. Content (profile, timeline, skills) is authored
// per record in src/data/*.ts and derived into strings by index.ts.

export interface Translations {
  meta: {
    title: string;
    description: string;
    skipLink: string;
    langToggleAria: string;
  };
  nav: {
    primary: string;
  };
  hero: {
    eyebrow: string;
    linkGithub: string;
    linkLinkedin: string;
    linkEmail: string;
    linkCV: string;
  };
  sections: {
    timeline: string;
    archive: string;
    writeups: string;
    skills: string;
    contact: string;
  };
  /** Small chrome words used by the hero / timeline markup. (Not `timeline`:
      that key is taken by the derived per-node content strings.) */
  ui: {
    /** Prefix of the compact non-featured project line: "also: a · b · c". */
    alsoLabel: string;
    /** Prefix of the expected graduation month in the hero degree line. */
    gradLabel: string;
  };
  contact: {
    emailLabel: string;
    linkedinLabel: string;
    githubLabel: string;
    locationLabel: string;
    footer: string;
  };
  notFound: {
    code: string;
    heading: string;
    body: string;
    backHome: string;
    backHomeAria: string;
  };
}

export type LangCode = 'en' | 'pt';
