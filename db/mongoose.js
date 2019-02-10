var mongoose = require('mongoose');


mongoose.Promise = global.Promise; //Set up Mongoose to use promisses.
mongoose.connect('mongodb://localhost:27017/dgchannel');

module.exports = {
    mongoose
};