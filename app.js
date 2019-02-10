var _ = require('lodash');

var ts3 = require('./teamspeak/app.js');
var ts3core = require('./teamspeak/teamspeak.js');
var {apiSettings} = require('./teamspeak/channelProperties.js');
var {Teams} = require('./models/teams.js')
var {gameArea} = require('./models/game_area.js')

let name = 'Swag7';
let ownerUuid = 'smgDpLgFrZmV2FrK/PwWvFCA2Pw=';
let password = '';
let gameAreaId = 2;





ts3.createTeam('name2', 'password', ownerUuid, gameAreaId, true);







const addMemberToTeam = (memberId, teamID) => {

     
}



const removeMemberFromTeam = (memberId, teamID) => {

     
}



const cleanUpChannels = () => {

     
}



// ts3.createChannel('name1', 'password', 'topic', 'description', 1);

// console.log(ts3.editChannel('name', 'password', 'topic', 'description', 156));

// ts3.subChannelList(165)
//     .then(channels => {
//         channels.forEach(channel => {
//            console.log(channel);
//         });
//     })
//     .catch(err => console.log(err));

// ts3.createChannel(true, 'name', 'password', 'topic', 'description')
//     .then(() => { return ts3.editChannel(false, 184, 'EntradaTeamSpeak', 'password', 'topic', 'description')})
//     .then(() => console.log('successful!'))
//     .catch(err => console.log('Errror Main', err));

//ts3.createTeam()
