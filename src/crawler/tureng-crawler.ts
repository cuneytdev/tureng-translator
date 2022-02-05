import { Config, ElementName, TranslationType, Word, WordBlock } from './models';
import Crawler = require('crawler');

export function translate(word: string, translateType: TranslationType, config?: Config) {
  return crawl(word, translateType).then((resp) => {
    let words = resp;

    if (config && !config.detailed) {
      words = [words[0]];
    }

    if (config && config.amount) {
      words = isExpectedAmount(words, config.amount);
    }
    return words;
  });
}

function crawl(word: string, translationType: TranslationType): Promise<WordBlock[]> {
  return new Promise<WordBlock[]>((resolve, reject) => {
    const c = new Crawler({
      maxConnections: 10,
      callback: (error: any, res: any, done: any) => {
        if (error) {
          reject(error);
        } else {
          const $ = res.$;
          const searchResults = $(`.tureng-searchresults-col-left`).contents().filter('.table');
          const allWords: WordBlock[] = [];
          searchResults.each((_i: number, table: any) => {
            const words: Word[] = [];
            const wordBlock: WordBlock = { description: '', words };
            const tableChildren = table.children;
            if (!tableChildren) {
              return;
            }
            let order = 1;
            wordBlock.description = getWordsContainerHeader(table.prev.prev);
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
            allWords.push(wordBlock);
          });
          resolve(allWords);
        }
        done();
      },
    });
    const url = `https://tureng.com/en/${translationType}/${word}`;
    c.queue(url);
  });
}

function isExpectedAmount(allData: WordBlock[], amount: number) {
  let amountOfWords: number = 0;
  const filteredByAmount: WordBlock[] = [];
  allData.forEach((wordBlock, indexOfWordBlock) => {
    if (!filteredByAmount[indexOfWordBlock]) {
      filteredByAmount[indexOfWordBlock] = {
        description: '',
        words: [],
      };
    }
    filteredByAmount[indexOfWordBlock].description = wordBlock.description;
    wordBlock.words.forEach((word: Word) => {
      if (amountOfWords < amount) {
        filteredByAmount[indexOfWordBlock].words.push(word);
        amountOfWords++;
      }
    });
    if (filteredByAmount[indexOfWordBlock].words.length === 0) {
      delete filteredByAmount[indexOfWordBlock];
    }
  });
  return filteredByAmount;
}

function getWordsContainerHeader(hElement: any): string {
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
