"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOdd = void 0;
const is_even_1 = require("@acme-corp/is-even");
function isOdd(i) {
    return (0, is_even_1.isEven)(i) === false;
}
exports.isOdd = isOdd;
