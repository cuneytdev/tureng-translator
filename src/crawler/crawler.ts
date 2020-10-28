import Crawler = require('crawler');
import { TranslationType } from './models/language.enum';
import { ElementName, ElementType } from './models/element.enum';
import { Word } from './models/word.interface';
export class TurengCrawler {
  c: any;
  constructor() {}
  async translate(word: string, translationType: TranslationType): Promise<Word[]> {
    const words: Word[] = await this.crawl(word, translationType);
    return Promise.resolve(words);
  }

  crawl(word: string, translationType: TranslationType): Promise<Word[]> {
    return new Promise<Word[]>((resolve, reject) => {
      const words: Word[] = [];
      this.c = new Crawler({
        maxConnections: 10,
        callback: function (error, res, done) {
          if (error) {
            reject(error);
          } else {
            var $ = res.$;
            const searchResults = $(`.tureng-searchresults-col-left`).contents().filter('.table');
            searchResults.each((i, table) => {
              const tableChildren = table.children;
              if (!tableChildren) {
                return;
              }
              let order = 1;

              tableChildren.forEach((e: any, elementIndex: number) => {
                if (e.name) {
                  let word = new Word();
                  e.children.forEach((tdElement: any, tdElementIndex: number) => {
                    if (tdElement.name == ElementName.TD) {
                      if (!tdElement.children) {
                        return;
                      }
                      const aEl = tdElement.children.filter((e: any) => {
                        return e.name == ElementName.A;
                      });
                      const IEl = tdElement.children.filter((e: any) => {
                        return e.name == ElementName.I;
                      });
                      if (aEl.length > 0) {
                        if (IEl[0] && IEl[0].children[0]) {
                          const type = IEl[0].children[0].data;
                          word.type = type;
                        }
                        if (tdElement.attribs.class.includes('tm')) {
                          const translatedFrom = tdElement.attribs.lang;
                          word.translatedFrom = translatedFrom;
                          word.text = aEl[0].children[0].data;
                          word.order = order;
                          order++;
                        }
                        if (tdElement.attribs.class.includes('ts')) {
                          const translatedTo = tdElement.attribs.lang;
                          word.translatedTo = translatedTo;
                          word.translatedText = aEl[0].children[0].data;
                        }
                      }
                    }
                  });
                  if (word.text) {
                    words.push(word);
                  }
                }
              });
            });
            resolve(words);
          }
          done();
        },
      });
      const url = `https://tureng.com/en/${translationType}/${word}`;
      console.log('tureng url ->', url);
      this.c.queue(url);
    });
  }
}
