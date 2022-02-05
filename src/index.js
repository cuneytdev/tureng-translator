"use strict";
exports.__esModule = true;
var crawler_1 = require("./crawler/crawler");
var language_enum_1 = require("./crawler/models/language.enum");
var config = {
    amount: 1,
    detailed: true
};
var tc = new crawler_1.TurengCrawler();
tc.translate('car', language_enum_1.TranslationType.ENGTUR, config).then(function (e) {
    // tslint:disable-next-line:no-console
    console.log('translation', JSON.stringify(e));
});
