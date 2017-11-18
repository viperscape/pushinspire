const AWS = require ("aws-sdk");
const CONFIG = require("./config.json").aws;

var credentials = new AWS.SharedIniFileCredentials({profile: CONFIG.profile});
AWS.config.credentials = credentials;

const Dynamo = require("aws-sdk/clients/dynamodb");
const DB = new Dynamo.DocumentClient(CONFIG);

function add_quote(kind, quote, id) {
    const params = {
        TableName:"Inspire",
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
        TableName:"Inspire",
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

function add_contact(id, phone, cb) {
    const params = {
        TableName:"InspireSubs",
        Item: {
            "id": id,
            "phone": phone
        }
    };

    DB.put(params, function (err) {
        if (!err) cb();
    });
}
module.exports.add_contact = add_contact;

function rem_contact(id, cb) {
    const params = {
        TableName:"InspireSubs",
        Key: { "id": id }
    };

    DB.delete(params, function (err) {
        if (!err) cb();
    });
}
module.exports.rem_contact = rem_contact;

function get_contact(id, cb) {
    const params = {
        TableName:"InspireSubs",
        Key: { "id": id }
    };

    DB.get(params, function (err, data) {
        if (data && data.Item) cb ();
    });
}
module.exports.get_contact = get_contact;