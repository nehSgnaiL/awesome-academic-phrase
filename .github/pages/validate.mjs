import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pagesDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(pagesDirectory, "..", "..");
const sourceDirectory = path.join(pagesDirectory, ".build", "source");
const layout = fs.readFileSync(path.join(pagesDirectory, "_layouts", "default.html"), "utf8");
const styles = fs.readFileSync(path.join(pagesDirectory, "assets", "css", "page.scss"), "utf8");
const config = fs.readFileSync(path.join(pagesDirectory, "_config.yml"), "utf8");
const workflow = fs.readFileSync(path.join(repositoryRoot, ".github", "workflows", "pages.yml"), "utf8");
const generatedReadme = fs.readFileSync(path.join(sourceDirectory, "index.md"), "utf8");
const errors = [];

function requireMatch(source, pattern, message) {
  if (!pattern.test(source)) errors.push(message);
}

requireMatch(layout, /<script src="\/shared\/site-shell\.js" defer><\/script>/, "Layout must load the shared site shell.");
requireMatch(layout, /<shen-site-header><\/shen-site-header>/, "Layout is missing the shared header.");
requireMatch(layout, /<shen-site-footer><\/shen-site-footer>/, "Layout is missing the shared footer.");
requireMatch(styles, /html\[data-theme="dark"\]/, "Styles must respond to the shared dark theme.");
requireMatch(styles, /@media \(prefers-color-scheme: dark\)/, "Styles must retain a system dark-theme fallback.");
requireMatch(config, /^baseurl:\s*\/awesome-academic-phrase\s*$/m, "Jekyll base URL must match the project page.");
requireMatch(workflow, /actions\/deploy-pages@v5/, "Workflow must deploy through the Pages action.");
requireMatch(generatedReadme, /<details markdown="1">/, "Details blocks must opt into Kramdown parsing.");

if (errors.length) {
  for (const error of errors) console.error(`::error::${error}`);
  process.exitCode = 1;
} else {
  console.log("Validated the repository page and shared-site integration.");
}
