const Table = require("./table");
const QUOTES = require("./quotes.json");

const Config = require("./config");

var layout = {};

for (var n in QUOTES) {
    var i = 0;
    var kind = QUOTES[n];

    for (i; i < kind.length; i++) {
        var quote = kind[i];
        Table.add_quote(n, quote, i);
    }

    layout[n] = i-1;
}

Table.add_layout(layout);

Config.run_server(6990);