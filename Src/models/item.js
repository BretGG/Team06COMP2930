const mongoose = require("mongoose");
const joi = require("joi");
const _ = require('lodash');


/*

This file contains the the schema (essentially a class) for the database, that
holds the information for the shop items a user has. 

*/

const itemSchema = new mongoose.Schema({
    item: {    
        category: String,     
        itemNo: Number(1),
        own: Boolean
    },
    owner: {        //Do not validate for owner
        type: String,
        required: true
    }
});

// easier way to get cards
// ItemsSchema.methods.getCards = async function() {
//     return await Card.findAll({ Items: this._id })
// }

const Item = mongoose.model('Item', ItemsSchema);

var itemA1 = new item ({
  item: {category: 'avatar', itemNo = 1, own: true}
});

exports.Item = mongoose.model("Item", ItemsSchema);
