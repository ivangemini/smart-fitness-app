import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';

const outputPath = '.vitest-diagnostic.json';
const result = spawnSync(
  process.execPath,
  [
    './node_modules/vitest/vitest.mjs',
    'run',
    '--reporter=json',
    `--outputFile=${outputPath}`,
    '--no-file-parallelism',
  ],
  { encoding: 'utf8', stdio: ['ignore', 'inherit', 'inherit'] },
);

if (result.status === 0) {
  rmSync(outputPath, { force: true });
  process.exit(0);
}

try {
  const report = JSON.parse(readFileSync(outputPath, 'utf8'));
  const suites = Array.isArray(report.testResults) ? report.testResults : [];
  const failedSuites = suites.filter((suite) => suite.status === 'failed');
  console.error(`DIAGNOSTIC_FAILED_SUITES=${failedSuites.length}`);
  for (const suite of failedSuites) {
    console.error(`DIAGNOSTIC_FILE=${suite.name ?? 'unknown'}`);
    const assertions = Array.isArray(suite.assertionResults)
      ? suite.assertionResults.filter((item) => item.status === 'failed')
      : [];
    for (const assertion of assertions) {
      console.error(
        `DIAGNOSTIC_TEST=${assertion.fullName ?? assertion.title ?? 'unknown'}`,
      );
      const message = Array.isArray(assertion.failureMessages)
        ? assertion.failureMessages.join('\n')
        : '';
      console.error(`DIAGNOSTIC_MESSAGE=${message.slice(0, 1600)}`);
    }
    if (assertions.length === 0 && suite.message) {
      console.error(`DIAGNOSTIC_MESSAGE=${String(suite.message).slice(0, 1600)}`);
    }
  }
  if (failedSuites.length === 0) {
    console.error(`DIAGNOSTIC_REPORT_KEYS=${Object.keys(report).join(',')}`);
  }
} catch (error) {
  console.error(`DIAGNOSTIC_PARSE_ERROR=${String(error)}`);
}
rmSync(outputPath, { force: true });
process.exit(result.status ?? 1);
