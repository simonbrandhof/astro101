import type { APIRoute } from 'astro';

const prodBackendYml = `
backend:
  name: github
  repo: simonbrandhof/astro-101
  branch: main
  base_url: https://github-oauth-ojofun7zia-ew.a.run.app
  auth: github-oauth/auth
`;

const devBackendYml = `
local_backend: true
backend:
  name: git-gateway
  branch: main
  # see the script "start:cms" in package.json
  url: http://localhost:8081/api/v1
`;

const yml = `

site_url: "${import.meta.env.SITE}"
logo_url: "${new URL("/img/logo.png", import.meta.env.SITE).href}"
media_folder: "/src/assets"
public_folder: ""
locale: "en"
show_preview_links: true

collections:
  - label: "Petitions (English)"
    label_singular: "Petition (English)"
    name: "english_petitions"
    folder: "/src/content/petitions/en"
    format: "frontmatter"
    extension: "md"
    create: true
    identifier_field: "petitionKey"
    summary: "{{petitionKey}} - {{title}}"
    preview_path: "en/{{slug}}"
    editor:
      preview: false
    sortable_fields: ["petitionKey", "date"]
    fields: &fields
      - { label: "Key", name: "petitionKey", widget: "string", required: true }
      - { label: "Title", name: "title", widget: "string", required: true, hint: "Used by the listing page, Twitter Cards. Maximum is 70 characters.", pattern: [ ".{3,70}", "maximum 70 characters" ] }
      - { label: "Description", name: "description", widget: "string", hint: "Punchline displayed on the listing page and used by search engines" }
      - { label: "Content", name: "body", widget: "markdown" }
      - { label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD", time_format: false, date_format: "YYYY-MM-DD", required: true, "hint": "Date of creation, used to sort petitions" }
      - { label: "Opened", name: "opened", widget: "boolean", default: false, "hint": "Whether new signatures are accepted or not" }
      - { label: "Published", name: "published", widget: "boolean", default: false, "hint": "Whether petition is visible by users or not" }
      - { label: "Highlighted", name: "highlighted", widget: "boolean", default: false, "hint": "Highlighted petitions are displayed first in the list. Other petitions are sorted by descending date." }
      - { label: "Cover Image", name: "coverImage", widget: "image", required: false }
      - { label: "UTM Campaign", name: "utmCampaign", widget: "string", required: false }
      - { label: "Twitter - description (SEO only)", name: "twitterDescription", widget: "string", required: false, pattern: [ ".{3,200}", "maximum 200 characters" ], hint: "Short version of the description, usually if the latter is longer than 200 characters. Default is the petition description." }
      - { label: "Twitter - card image", name: "twitterImage", widget: "image", required: false, hint: "Optional image specific to Twitter Card, with an aspect ratio of 2:1 and minimum dimensions of 300x157 or maximum of 4096x4096 pixels. Image must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported. Only the first frame of an animated GIF will be used. SVG is not supported. Default is the petition cover image." }
      - { label: "Share on WhatsApp/Bluesky", name: "whatsappText", widget: "string", required: false, pattern: [ ".{0,300}", "maximum 300 characters" ], hint: "Text to display when sharing the petition on WhatsApp and Bluesky. Do not forget to include the link to the petition page. Default value is just the petition link." }
      - { label: "Email sharing - subject", name: "emailSubject", widget: "string", required: false, hint: "Subject of emails when sharing the petition. Default is the petition title." }
      - { label: "Email sharing - body", name: "emailBody", widget: "text", required: false, hint: "Required to display the email sharing button." }
      - { label: "Interpellation politiques", name: "interpellationPolitiques", widget: "markdown", required: false, hint: "Texte facultatif affiché sur le formulaire de signature." }
      - { label: "Mailjet - template ID of thanks emails", name: "mailjetThanksTemplateId", widget: "number", value_type: "int", required: false, hint: "Required if the petition is opened" }

  - label: "Petitions (French)"
    label_singular: "Petition (French)"
    name: "french_petitions"
    folder: "/src/content/petitions/fr"
    format: "frontmatter"
    extension: "md"
    create: true
    editor:
      preview: false
    identifier_field: "petitionKey"
    summary: "{{petitionKey}} - {{title}}"
    preview_path: "fr/{{slug}}"
    sortable_fields: ["petitionKey", "date"]
    fields: *fields
`.trim();

export const GET: APIRoute = () => {
  let result = import.meta.env.PROD ? prodBackendYml : devBackendYml;
  result += yml;

  return new Response(result, {
    headers: {
      'Content-Type': 'application/yaml',
    },
  });
};
