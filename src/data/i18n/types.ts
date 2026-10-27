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
  };
  nav: {
    primary: string;
  };
  hero: {
    linkGithub: string;
    linkLinkedin: string;
    linkEmail: string;
    linkCV: string;
    photoAlt: string;
  };
  sections: {
    highlights: string;
    timeline: string;
    archive: string;
    skills: string;
    contact: string;
  };
  /** Small chrome words used by the markup. (Not `timeline`: that key is
      taken by the derived per-node content strings.) */
  ui: {
    /** Prefix of the compact non-featured project line: "also: a · b · c". */
    alsoLabel: string;
    /** Prefix of the expected graduation month in the degree line. */
    gradLabel: string;
    /** Summary text of the <details> disclosure under leads and highlights. */
    details: string;
    /** Prefix before a repository link. */
    repoLabel: string;
    /** Short lowercase label per NodeKind. */
    kind: {
      origin: string;
      education: string;
      club: string;
      work: string;
      project: string;
    };
  };
  contact: {
    emailLabel: string;
    linkedinLabel: string;
    githubLabel: string;
    locationLabel: string;
    footer: string;
    /** Footer note after the build credit. */
    references: string;
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
