import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootTextFiles = [
  'package.json',
  'package-lock.json',
];

const rootTextPatterns = [
  /^tsconfig[^/]*\.json$/u,
  /^next\.config\.[^.]+$/u,
  /^eslint\.config\.[^.]+$/u,
  /^postcss\.config\.[^.]+$/u,
  /^tailwind\.config\.[^.]+$/u,
  /^vitest\.config\.[^.]+$/u,
  /^playwright\.config\.[^.]+$/u,
];

const textContentExtensions = /\.(cjs|css|js|jsx|json|md|mjs|sql|ts|tsx|txt|yaml|yml)$/u;

function normalized(filePath) {
  return filePath.replace(/\\/g, '/');
}

function findCaseCollisions(files) {
  const byLowercase = new Map();

  for (const file of files) {
    const key = normalized(file).toLocaleLowerCase('en-US');
    const entries = byLowercase.get(key) ?? [];
    entries.push(file);
    byLowercase.set(key, entries);
  }

  return [...byLowercase.values()].filter((entries) => new Set(entries).size > 1);
}

function isForbiddenArtifact(filePath) {
  const file = normalized(filePath);
  const lower = file.toLocaleLowerCase('en-US');
  const base = path.posix.basename(lower);

  if (base === '.env' || base === '.env.local') {
    return true;
  }

  if (lower === '_ds_bundle.js' || lower.endsWith('/_ds_bundle.js')) {
    return true;
  }

  if (lower === '.next' || lower.startsWith('.next/') || lower.includes('/.next/')) {
    return true;
  }

  if (/\.(pem|p12|pfx|key)$/u.test(base)) {
    return true;
  }

  if (base.endsWith('.json') && /service[-_ ]?account/u.test(base)) {
    return true;
  }

  if (lower.includes('design-system') && base.endsWith('.zip')) {
    return true;
  }

  if (
    lower.includes('design-system') &&
    /screenshot/u.test(base) &&
    /\.(png|jpe?g|webp)$/u.test(base)
  ) {
    return true;
  }

  return false;
}

export function shouldScanContent(filePath) {
  const file = normalized(filePath);
  const lower = file.toLocaleLowerCase('en-US');

  if (rootTextFiles.includes(lower)) {
    return true;
  }

  if (!file.includes('/') && rootTextPatterns.some((pattern) => pattern.test(lower))) {
    return true;
  }

  if (/^scripts\/.+\.(js|mjs)$/u.test(lower)) {
    return true;
  }

  if (/^\.github\/.+\.(md|ya?ml)$/u.test(lower)) {
    return true;
  }

  if (/^(src|docs|tests)\//u.test(file) && textContentExtensions.test(lower)) {
    return true;
  }

  return false;
}

function formatLocation(buffer, index) {
  const before = buffer.subarray(0, index).toString('utf8');
  const lines = before.split(/\n/u);
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;

  return `${line}:${column}`;
}

function findHiddenCharacters(filePath) {
  const buffer = readFileSync(filePath);
  const findings = [];

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xef &&
    buffer[1] === 0xbb &&
    buffer[2] === 0xbf
  ) {
    findings.push(`${filePath}:1:1 BOM`);
  }

  for (let index = 0; index < buffer.length; index += 1) {
    const byte = buffer[index];
    const isAllowedWhitespace = byte === 0x09 || byte === 0x0a || byte === 0x0d;

    if (byte < 0x20 && !isAllowedWhitespace) {
      findings.push(
        `${filePath}:${formatLocation(buffer, index)} ASCII control 0x${byte
          .toString(16)
          .padStart(2, '0')}`,
      );
    }
  }

  const text = buffer.toString('utf8');
  const bidiPattern = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/gu;
  for (const match of text.matchAll(bidiPattern)) {
    const index = match.index ?? 0;
    const codePoint = match[0].codePointAt(0)?.toString(16).toUpperCase();
    findings.push(`${filePath}:${formatLocation(buffer, index)} bidi control U+${codePoint}`);
  }

  return findings;
}

function run() {
  const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);

  const failures = [];

  function addFailure(title, details) {
    failures.push({ title, details });
  }

  const caseCollisions = findCaseCollisions(trackedFiles);
  if (caseCollisions.length > 0) {
    addFailure(
      'Tracked paths differ only by case',
      caseCollisions.map((entries) => `- ${entries.join('\n  ')}`),
    );
  }

  const forbiddenArtifacts = trackedFiles.filter(isForbiddenArtifact);
  if (forbiddenArtifacts.length > 0) {
    addFailure(
      'Forbidden tracked artifact or secret-like path',
      forbiddenArtifacts.map((file) => `- ${file}`),
    );
  }

  if (
    trackedFiles.includes('.github/PULL_REQUEST_TEMPLATE.md') &&
    trackedFiles.includes('.github/pull_request_template.md')
  ) {
    addFailure('Both PR template case variants are tracked', [
      '- .github/PULL_REQUEST_TEMPLATE.md',
      '- .github/pull_request_template.md',
    ]);
  }

  const hiddenCharacterFindings = trackedFiles
    .filter(shouldScanContent)
    .flatMap((file) => findHiddenCharacters(file));

  if (hiddenCharacterFindings.length > 0) {
    addFailure('Hidden or dangerous control characters found', hiddenCharacterFindings);
  }

  if (failures.length > 0) {
    console.error('Repository hygiene check failed.');
    for (const failure of failures) {
      console.error(`\n${failure.title}:`);
      for (const detail of failure.details) {
        console.error(detail);
      }
    }
    process.exit(1);
  }
}

const invokedPath = process.argv[1] ? fileURLToPath(new URL(`file://${path.resolve(process.argv[1])}`)) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  run();
}
