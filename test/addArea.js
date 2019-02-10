var {mongoose} = require('../db/mongoose.js');
var {gameArea} = require('../models/game_area.js')

let game = new gameArea({
    areaId: 1,
    areaName: 'CsGo',
    nextChannelNumber: 0,
    lastChannelId: 470,
    nextSpacerNumber: 600000,
    
});

game.save().then((doc) => { //Saving the data to the database
console.log('Data Saved Successfully', doc)
}, (e) => {
console.log('Data Could not be saved:', e)
}).catch((e) => {
console.log('Error Writing to DB', e);
});