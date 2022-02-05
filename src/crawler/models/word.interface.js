"use strict";
exports.__esModule = true;
exports.Word = void 0;
var Word = /** @class */ (function () {
    function Word(word) {
        var _this = this;
        if (word) {
            var keys = Object.keys(word);
            keys.forEach(function (el) {
                var key = el;
                _this[key] = word[key];
            });
        }
    }
    return Word;
}());
exports.Word = Word;
