import puppeteer from 'puppeteer';
import { join } from 'path';

const docsDir = 'C:/Users/matid/Documents';

const files = [
  { input: 'CV_Mateusz_Dombrowski_PL.html', output: 'CV_Mateusz_Dombrowski_PL.pdf' },
  { input: 'CV_Mateusz_Dombrowski_EN.html', output: 'CV_Mateusz_Dombrowski_EN.pdf' },
];

async function generatePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const file of files) {
    try {
      const inputPath = join(docsDir, file.input);
      const outputPath = join(docsDir, file.output);

      await page.goto(`file:///${inputPath.replace(/\\/g, '/')}`, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait a bit for fonts to load
      await new Promise(r => setTimeout(r, 2000));
      
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      });

      console.log(`✅ ${file.output} wygenerowany!`);
    } catch (err) {
      console.error(`❌ Błąd przy ${file.input}:`, err.message);
    }
  }

  await browser.close();
  console.log('\n📄 Gotowe! PDF-y są w:', docsDir);
}

generatePDF().catch(console.error);
