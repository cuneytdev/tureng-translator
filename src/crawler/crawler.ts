import Crawler = require('crawler');
import { TranslationType } from './models/language.enum';
import { ElementName, ElementType } from './models/element.enum';
import { Word, WordBlock } from './models/word.interface';
export class TurengCrawler {
  c: any;
  async translate(word: string, translationType: TranslationType): Promise<WordBlock[]> {
    const words: WordBlock[] = await this.crawl(word, translationType);
    return Promise.resolve(words);
  }

  crawl(word: string, translationType: TranslationType): Promise<WordBlock[]> {
    return new Promise<WordBlock[]>((resolve, reject) => {
      this.c = new Crawler({
        maxConnections: 10,
        callback: ((error: any, res: any, done: any) => {
          if (error) {
            reject(error);
          } else {
            const $ = res.$;
            const searchResults = $(`.tureng-searchresults-col-left`).contents().filter('.table');
            const allWords: WordBlock[] = [];
            searchResults.each((i: number, table: any) => {
              const words: Word[] = [];
              const wordBlock: WordBlock = { description: '', words };
              const tableChildren = table.children;
              if (!tableChildren) {
                return;
              }
              let order = 1;
              wordBlock.description = this.getWordsContainerHeader(table.prev.prev);
              tableChildren.forEach((tableElement: any) => {
                if (tableElement.name) {
                  const wordProp = new Word();
                  tableElement.children.forEach((tdElement: any) => {
                    if (tdElement.name === ElementName.TD) {
                      if (!tdElement.children) {
                        return;
                      }
                      const aEl = tdElement.children.filter((e: any) => {
                        return e.name === ElementName.A;
                      });
                      const IEl = tdElement.children.filter((e: any) => {
                        return e.name === ElementName.I;
                      });

                      if (tdElement.attribs.class && tdElement.attribs.class === 'hidden-xs') {
                        wordProp.category = tdElement.children[0].data;
                      }

                      if (aEl.length > 0) {
                        if (IEl[0] && IEl[0].children[0]) {
                          const type = IEl[0].children[0].data;
                          wordProp.type = type;
                        }
                        if (tdElement.attribs.class.includes('tm')) {
                          const translatedFrom = tdElement.attribs.lang;
                          wordProp.translatedFrom = translatedFrom;
                          wordProp.text = aEl[0].children[0].data;
                          wordProp.order = order;
                          order++;
                        }
                        if (tdElement.attribs.class.includes('ts')) {
                          const translatedTo = tdElement.attribs.lang;
                          wordProp.translatedTo = translatedTo;
                          wordProp.translatedText = aEl[0].children[0].data;
                        }
                      }
                    }
                  });
                  if (wordProp.text) {
                    words.push(wordProp);
                  }
                }                
              });
              wordBlock.words = words;
              allWords.push(wordBlock)
            });
            resolve(allWords);
          }
          done();
        }).bind(this),
      });
      const url = `https://tureng.com/en/${translationType}/${word}`;
      this.c.queue(url);
    });
  }

  getWordsContainerHeader(hElement: any): string {
    let header = '';
    hElement.children.forEach((el: any) => {
      if (el.name === ElementName.B) {
        header = header + el.children[0].data;
      } else {
        header = header + el.data;
      }
    });
    return header;
  }
}
