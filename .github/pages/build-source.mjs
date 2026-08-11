import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pagesDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(pagesDirectory, "..", "..");
const sourceDirectory = path.join(pagesDirectory, ".build", "source");

fs.rmSync(sourceDirectory, { recursive: true, force: true });
fs.mkdirSync(sourceDirectory, { recursive: true });

for (const relativePath of ["_config.yml", "_layouts", "assets"]) {
  fs.cpSync(
    path.join(pagesDirectory, relativePath),
    path.join(sourceDirectory, relativePath),
    { recursive: true },
  );
}

const readme = fs
  .readFileSync(path.join(repositoryRoot, "README.md"), "utf8")
  .replaceAll("<details>", '<details markdown="1">');

fs.writeFileSync(
  path.join(sourceDirectory, "index.md"),
  `---\nlayout: default\npermalink: /\n---\n\n${readme}`,
);

console.log(
  `Prepared Pages source in ${path.relative(repositoryRoot, sourceDirectory)}`,
);
