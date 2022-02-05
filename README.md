### Tureng Translator

This package allows you to get multiple meanings of a word asynchronously between;

+ Turkish to English
+ English to Turkish
+ French to English
+ Spanish to English
+ German to English

#### Example　

```javascript
 const config: Config = {
   amount: 1,   
   //you can specify how many word meanings you want
   detailed: false; 
   //allows you get all meanings of a word or just the first table on tureng.com
   //detailed property is set false default
 }
 //  config 
translate("aircraft", TranslationType.ENGTUR, config).then((resp: WordBlock[])=>{
   // resp => 
    /*[{
     description: 'Meanings of "aircraft" in Turkish English Dictionary : 42 result(s)',
     words: [ [Word] ]
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
});
