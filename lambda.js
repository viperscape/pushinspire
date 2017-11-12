'use strict';

const AWS = require('aws-sdk');

const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });
const PHONE_NUMBER = '+1...';

const MAX_QUOTES = 20;

const Doc = require('dynamodb-doc');
const DB = new Doc.DynamoDB();
const TABLE = "Inspire";

function get_layout (cb) {
    const params = {
        TableName:TABLE,
        Key: { 
            "kind":"Layout",
            "id": 0,
        }
    };

    DB.getItem(params, function (err, data) {
        if (data) { cb(data.Item); }
    });
}

exports.handler = (event, context, callback) => {
    const dblClick = (event["clickType"] == "DOUBLE");
    
    get_layout(function (layout) {
        var pick;
        var pickn;
        
        if (dblClick) { 
            pick = "Spirit";
            pickn = layout.kinds["Spirit"]; 
        }
        else {
            var n = Math.floor(Math.random() * Object.keys(layout.kinds).length);
            pick = Object.keys(layout.kinds)[n];
            pickn = layout.kinds[pick];
        }
        
        var n = Math.floor(Math.random() * pickn);
        const paramsDB = {
            TableName:TABLE, 
            Key: { 
                "kind": pick,
                "id": n
            }
        };
        
        DB.getItem(paramsDB, function (err,data) {
            if (data && data.Item && data.Item.quote) {
                const paramsSNS = {
                    PhoneNumber: PHONE_NUMBER,
                    Message: data.Item.quote + " - " + data.Item.person,
                };
                SNS.publish(paramsSNS, callback);
            }
        });
    });
};
