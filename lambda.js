'use strict';

const AWS = require('aws-sdk');

const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

const Doc = require('dynamodb-doc');
const DB = new Doc.DynamoDB();

function get_layout (cb) {
    const params = {
        TableName:"Inspire",
        Key: { 
            "kind":"Layout",
            "id": 0,
        }
    };

    DB.getItem(params, function (err, data) {
        if (data.Item) { cb(data.Item); }
    });
}

function get_contact (id, cb) {
    const params = {
        TableName:"InspireSubs",
        Key: {
            "id": id,
        }
    };

    DB.getItem(params, function (err, data) {
        if (data.Item) { cb(data.Item); }
        else { // debug put item
            const params = {
                TableName:"InspireSubs",
                Item: {
                    "id": id,
                }
            };
            DB.putItem(params, function() {});
        }
    });
}

exports.handler = (event, context, callback) => {
    const dblClick = (event["clickType"] == "DOUBLE");
    get_contact(event.serialNumber, function (contact) {
        if (!contact.phone) return;
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
                TableName:"Inspire", 
                Key: { 
                    "kind": pick,
                    "id": n
                }
            };
            
            DB.getItem(paramsDB, function (err,data) {
                if (data && data.Item && data.Item.quote) {
                    const paramsSNS = {
                        PhoneNumber: contact.phone,
                        Message: data.Item.quote + " - " + data.Item.person,
                    };
                    SNS.publish(paramsSNS, callback);
                }
            });
        }); 
    });
};
