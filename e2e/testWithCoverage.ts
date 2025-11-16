import { test as base, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createCoverageMap } from 'istanbul-lib-coverage';
import v8ToIstanbul from 'v8-to-istanbul';

const coverageEnabled = process.env.COVERAGE === '1';
const coverageDir = path.join(process.cwd(), '.playwright-coverage');

if (coverageEnabled) {
  fs.mkdirSync(coverageDir, { recursive: true });
}

const aggregatedCoverage = createCoverageMap();
let exitHookRegistered = false;

const test = coverageEnabled
  ? base.extend({
      page: async ({ page }, use) => {
        await page.coverage.startJSCoverage({
          resetOnNavigation: false,
          reportAnonymousScripts: false,
        });

        await use(page);

        let entries: Awaited<ReturnType<typeof page.coverage.stopJSCoverage>>;
        try {
          entries = await page.coverage.stopJSCoverage();
        } catch (error) {
          console.warn('No se pudo detener la cobertura de JS:', (error as Error).message);
          return;
        }

        for (const entry of entries) {
          if (!entry.url.startsWith('http://localhost:3000/_next')) {
            continue;
          }

          let source = entry.source;

          if (!source) {
            try {
              const response = await fetch(entry.url);
              if (!response.ok) {
                continue;
              }
              source = await response.text();
            } catch (error) {
              console.warn(`No se pudo obtener el código fuente de ${entry.url}: ${(error as Error).message}`);
              continue;
            }
          }

          try {
            const filePath = entry.url.replace('http://localhost:3000', '');
            const sanitizedSource = source.replace(/\/\/# sourceMappingURL=.*$/gm, '');
            const converter = v8ToIstanbul(filePath, 0, { source: sanitizedSource });
            await converter.load();
            converter.applyCoverage(entry.functions);
            aggregatedCoverage.merge(converter.toIstanbul());
          } catch (error) {
            console.warn(`No se pudo procesar la cobertura de ${entry.url}: ${(error as Error).message}`);
          }
        }
      },
    })
  : base;

if (coverageEnabled && !exitHookRegistered) {
  exitHookRegistered = true;
  process.once('exit', () => {
    if (aggregatedCoverage.files().length === 0) {
      console.warn(
        'No se recolectó información de cobertura. Verifica que las páginas de Next.js se cargaron completamente antes de cerrar el navegador.',
      );
      return;
    }

    const filteredCoverage = createCoverageMap();

    for (const file of aggregatedCoverage.files()) {
      if (
        file.startsWith('/_next/static/chunks/src_') ||
        file.startsWith('/_next/static/chunks/app/') ||
        file.startsWith('/_next/static/chunks/(app-pages-browser)/src')
      ) {
        filteredCoverage.merge(aggregatedCoverage.fileCoverageFor(file));
      }
    }

    const targetCoverageMap = filteredCoverage.files().length > 0 ? filteredCoverage : aggregatedCoverage;

    const finalSummary = targetCoverageMap.getCoverageSummary();
    const coverageJsonPath = path.join(coverageDir, 'coverage.json');
    const reportPath = path.join(coverageDir, 'report.txt');

    fs.writeFileSync(coverageJsonPath, JSON.stringify(targetCoverageMap.toJSON(), null, 2), 'utf8');

    const summaryText = [
      '============================ Coverage summary ============================',
      `Statements : ${finalSummary.statements.pct.toFixed(2)}% ( ${finalSummary.statements.covered}/${finalSummary.statements.total} )`,
      `Branches   : ${finalSummary.branches.pct.toFixed(2)}% ( ${finalSummary.branches.covered}/${finalSummary.branches.total} )`,
      `Functions  : ${finalSummary.functions.pct.toFixed(2)}% ( ${finalSummary.functions.covered}/${finalSummary.functions.total} )`,
      `Lines      : ${finalSummary.lines.pct.toFixed(2)}% ( ${finalSummary.lines.covered}/${finalSummary.lines.total} )`,
      '=========================================================================',
      '',
      'Cobertura consolidada de los módulos del frontend ejercitados en las pruebas E2E.',
    ].join('\n');

    fs.writeFileSync(reportPath, summaryText, 'utf8');
    console.log(`\n${summaryText}`);
    console.log(`Cobertura E2E generada en: ${coverageDir}`);
    console.log(`Resumen detallado guardado en: ${reportPath}`);
  });
}

export { test, expect };
