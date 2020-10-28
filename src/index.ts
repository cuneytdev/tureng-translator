import { TurengCrawler } from './crawler/crawler';
import { TranslationType } from './crawler/models/language.enum';

const tc = new TurengCrawler();
getCrawl();

async function getCrawl() {
  const data = await tc.translate("amusement", TranslationType.FREENG);
  console.log(data);
}
