// UI chrome strings, one file per language. Content (profile, projects,
// experience, education, skills) is authored in both languages per record in
// src/data/*.ts and read with `pick(l, lang)`.

export interface Translations {
  meta: {
    title: string;
    description: string;
    skipLink: string;
  };
  sections: {
    projects: string;
    more: string;
    experience: string;
    education: string;
    skills: string;
  };
  /** Mono row labels of the masthead. */
  rows: {
    education: string;
    seeking: string;
    links: string;
  };
  links: {
    resume: string;
    github: string;
    linkedin: string;
    email: string;
  };
  ui: {
    /** Figure tag prefix: "FIG." */
    fig: string;
    /** Prefix of the expected graduation month. */
    gradLabel: string;
    /** Tooltip on figures that open full size (JS only). */
    zoom: string;
    /** aria-label of the lightbox close button (JS only). */
    close: string;
    /** Name of the other language, in that language, for the switch link. */
    otherLang: string;
  };
  footer: string;
  notFound: {
    heading: string;
    body: string;
    backHome: string;
  };
}

export type LangCode = 'en' | 'pt';
