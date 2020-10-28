### Tureng Translator

This package allows you to get multiple meanings of a word asynchronously between;

+ Turkish to English
+ English to Turkish
+ French to English
+ Spanish to English
+ German to English

####Example　

```javascript
 const tc = new TurengCrawler();
 const data = await tc.translate("aircraft", TranslationType.ENGTUR);
 /*[{
     description: 'Meanings of "aircraft" in Turkish English Dictionary : 42 result(s)',
     words: [ ...[Word] ]
     },
	 {
      description: 'Meanings of "aircraft" with other terms in English Turkish Dictionary : 500 result(s)',
      words: [...[Word]]
    }]
  
    also word has these properties;
  
    {
        category: 'Common Usage',
        type: 'n. ',
        translatedFrom: 'en',
        text: 'aircraft',
        order: 1,
        translatedTo: 'tr',
        translatedText: 'uçak'
    } 
  */