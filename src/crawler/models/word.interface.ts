export class Word {
  text: string;
  translatedText: string;
  order: any;
  category: string;
  translatedFrom: string;
  translatedTo: string;
  type: string;
  constructor(word?: Word) {
    if (word) {
      const keys = Object.keys(word);
      keys.forEach((el: string) => {
        const key = el as keyof Word;
        this[key] = word[key];
      });
    }
  }
}

export interface WordBlock {
  description: string;
  words: Word[];
}
