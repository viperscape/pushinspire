const Table = require("./table");

const QUOTES = require("./quotes.json");

for (var n in QUOTES) {
    for (var i = 0; i < QUOTES[n].length; i++) {
        var quote = QUOTES[n][i];
        Table.add_quote(n, quote, i);
    }
}