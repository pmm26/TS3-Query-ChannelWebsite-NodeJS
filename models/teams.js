const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash')

var teamsSchema = new mongoose.Schema({
    
    
    teamName: { 
        type: String,
        // require: true,
        minLenght: 6,
        trim: true, //removes white space behind and in front
    },

    gameArea: {
        type: Number,
        // require: true,
        minLenght: 1
    },

    channelOrder: {
        type: Number,
        // require: true,
        minLenght: 1
    },

    members: [
        {   
            memberId: {
                type: String,
                // require: true,
                minLenght: 6
            },

            memberUuid: {
                type: String,
                // require: true,
                minLenght: 6
            },

            permissions: {
                type: Number,
                // require: true,
                minLenght: 6
                //add min and max value
            },

        }
    
    ],
   
    spacerNumber: {
        type: Number,
        // require: true,
        minLenght: 1
    },

    mainChannelId: {
        type: Number,
        // require: true,
        minLenght: 1
    },

    spacerEmptyId: {
        type: Number,
        // require: true,
        minLenght: 1
    },

    spacerBarId: {
        type: Number,
        // require: true,
    minLenght: 1
    },

    serverGroupId: {
        type: Number,
        default: null,
        // require: true,
        minLenght: 1
    },

    status: {
        type: String,
        // require: true,
        minLenght: 1,
        default: 'OK'
    },

    creationDate: {
        type: Date,
        // require: true,
        default: Date.now
    },
    
    nextMove: {
        type: Date,
        // require: true,
        default: Date.now
    },

    lastUsed: {
        type: Date,
        // require: true,
        default: Date.now
    },
    
});


//Create Model
var Teams = mongoose.model('Teams', teamsSchema);


module.exports = {
    Teams
};




// //Create Entry
// var newUser = new User({
//     email: 'pmm34@kent.ac.uk  ',
// });


// //Save Data on Database
// newUser.save().then((doc) => {

//     console.log('Saved:', doc);
    
// }, (e) => {
//     console.log('Unable to save', e)
// });
