const AWS = require ("aws-sdk");
const Dynamo = require("aws-sdk/clients/dynamodb");
const DB = new Dynamo.DocumentClient({"region": "us-west-2"});

const TABLE = "Inspire";

function add_quote(kind, quote, id) {
    const params = {
        TableName:TABLE,
        Item: { 
            "kind":kind,
            "id": id,
            "quote": quote.quote,
            "person": quote.person 
        }
    };

    DB.put(params, function (err) {
        if (err) console.error(err)
    });
}
module.exports.add_quote = add_quote;


function add_layout(layout) {
    const params = {
        TableName:TABLE,
        Item: { 
            "kind":"Layout",
            "id": 0,
            "kinds": layout
        }
    };

    DB.put(params, function (err) {
        if (err) console.error(err)
    });
}
module.exports.add_layout = add_layout;