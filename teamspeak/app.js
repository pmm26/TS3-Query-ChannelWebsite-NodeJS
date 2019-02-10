var ts3core = require('./teamspeak.js');
var {apiSettings} = require('./channelProperties.js');
var {mongoose} = require('../db/mongoose.js');
var {gameArea} = require('../models/game_area.js')
var {Teams} = require('../models/teams.js')
let _ = require('lodash');

// console.log(ts3.serverGroupCopy(6, 'Swag77727'));



const claimTeam = (teamID, name) => {

    Teams.findById(teamID).then((team) => {
        
        let processedName = '[cspacer' + team.spacerNumber + ']' + team.gameArea + ' ' + team.channelOrder + ' - ★ ' + name + ' ★';

        ts3core.editChannel(true, team.mainChannelId, processedName, '', 'topic', 'description');

        ts3core.subChannelList(team.mainChannelId).then(channels => {    
           
            channels.forEach((channel, i)  => {
                if (i != channels.length) {
                    ts3core.editChannel(true, channel.cid, apiSettings.channelLayout.subChannelName + i, '', 'topic', 'description');
                } else {
                    ts3core.editChannel(true, channel.cid, apiSettings.channelLayout.awayChannelName, 'topic', 'description');
                }
            });

        }).then(() => {

            //Set channel free in the database.
            Teams.findByIdAndUpdate(
                team._id,
                { $set: { teamName: name }}) //Add Member
            .then((todo) => {
                if (!todo) { 
                    console.log('Error', todo);
                }
                console.log('Sucess', todo);

            }).catch((e) => {
                console.log('Error', e);
            });

        }).catch(e => {
            console.log('claimTeam: Error Editing Channels', e);
        });

        

    }).catch(e => {
        console.log('claimTeam: Team Not Found', e);
        
    });
}


const createTeam = (name, password, ownerUuid, gameAreaId, move) => {


    
    let topic = '';
    let description = '';
    

    //TODO Add the Topic and Description Generator


    gameArea.findOne({areaId: gameAreaId})
    .then((area) => {
        if (!area) {
           console.log();
        } 
        console.log(area);


        let processedName = '[cspacer' + area.nextSpacerNumber + ']' + area.areaName[0] + area.nextChannelNumber + ' - ★ ' + name + ' ★'
        console.log(name);
        
        createGroupOfChannels(processedName, password, topic, description, area.nextSpacerNumber, area.lastChannelId)
        .then(channelIds => {

            //Storing in the database details about the Channel and the Teamspeak Channel ids.
            let team = new Teams(Object.assign({
                    teamName: name,
                    ownerUuid: ownerUuid,
                    channelOrder: area.nextChannelNumber,
                    spacerNumber: area.nextSpacerNumber,
                    gameArea: 1,
                    // creationDate:
                    // nextMove:
                    // lastUsed:
                    members: [ {   
                        memberId: 1,      
                        memberUuid: ownerUuid,
                        permissions: 1
                    }
                    ]
                    
                }, channelIds));

            //Save the New Channel
            team.save()
            .then((doc) => { //Saving the data to the database
                console.log('Data Saved Successfully', doc)
            }, (e) => {
                console.log('Data Could not be saved:', e)
            }).catch((e) => {
                console.log('Error Writing to DB', e);
            });

            //Update the GameArea
            gameArea.findOneAndUpdate(
                { areaId: gameAreaId },
                { $inc: { nextChannelNumber: 1, nextSpacerNumber: 1 },
                  $set: { lastChannelId: apiSettings.channelLayout.awayChannelNamed } })
            .then((todo) => {
                if (!todo) { 
                    console.log('Error', todo);
                }
                console.log('Sucess', todo);
        
            }).catch((e) => {
                console.log('Error', e);
            });

            //Get User DBID
            ts3core.getCldbidFromUid(ownerUuid)
            .then(cldbid => { 
                //Get list of SubChannels
                ts3core.subChannelList(channelIds.mainChannelId)
                .then(channels => {

                    //Set Channel Group to all SubChannels
                    channels.forEach(channel => {
                        ts3core.setChannelGroup(apiSettings.groups.channelAdmin, channel.cid, cldbid);
                    });
                
                    //Move Client
                    if (move) {
                        ts3core.moveClient(ownerUuid, channels[0].cid);
                    }

                });
            });
        
        })
        .catch((e) => {
            console.log('Error', e);
        });
    })
    .catch((e) => {
            console.log('Not found!', e)
    });

}

const createGroupOfChannels = (name, password, topic, description, spacerNumber, lastCid) => {

    //Connect to the database and get the last ids and numbers of the channel

    return ts3core.createChannel( false, name, '', topic, description, '', lastCid)
    .then(parentCid => { 
        let mainChannelId = parentCid;
        ts3core.createChannel(true, apiSettings.channelLayout.subChannelName + ' 1', password, topic, description, parentCid, '')
        ts3core.createChannel(true, apiSettings.channelLayout.subChannelName + ' 2', password, topic, description, parentCid, '');
        ts3core.createChannel(true, apiSettings.channelLayout.subChannelName + ' 3', password, topic, description, parentCid, '');
        ts3core.createChannel(true, apiSettings.channelLayout.awayChannelName, password, topic, description, parentCid, '');
            
        return ts3core.createChannel(true, '[rspacer' + spacerNumber + ']', '', '', '', '', parentCid)
        .then(parentCid => {
            let spacerEmptyId = parentCid;
            return ts3core.createChannel(false, '[*spacer' + spacerNumber + ']' + apiSettings.channelLayout.spacerBar, '', '', '', '', parentCid)
            .then(spacerBarId => {
                          
                //SAVE DATA TO THE DATABASE
                return channelIds = {
                    mainChannelId: mainChannelId,
                    spacerEmptyId: spacerEmptyId,
                    spacerBarId: spacerBarId
                }
            
            })
            .catch(err => console.log('Errror Saving', err));        
        })
        .then(channelIds => { return channelIds; })
        .catch(err => console.log('Error Creating Sub Channels', err));
    })
    .then(channelIds => { return channelIds; })
    .catch(err => console.log('Error Creating Main Channel', err));
}


const setSubChannelsPrivate = (cid) => {

    cid = parseInt(cid);

    //Get the List of the SubChannels;
    ts3core.subChannelList(cid)
    .then(channels => {

        //Set Channel Group to all SubChannels
        channels.forEach((value, i)  => {

            subIndex = i + 1;
        
            if (!(subIndex == channels.length)) {
                subName = apiSettings.channelLayout.subChannelName + " " + subIndex;

            } else {
                subName = apiSettings.channelLayout.awayChannelName;
            }

                ts3core.editChannel(false, value.cid, subName, '', '', '');
        });

    }).catch(e => {
        console.log(e);
    });

}

const setSubChannelsPublic = (cid) => {

    cid = parseInt(cid);

    //Get the List of the SubChannels;
    ts3core.subChannelList(cid)
    .then(channels => {

        //Set Channel Group to all SubChannels
        channels.forEach((value, i)  => {

            subIndex = i + 1;
        
            if (!(subIndex == channels.length)) {
                subName = apiSettings.channelLayout.subChannelName + " " + subIndex;

            } else {
                subName = apiSettings.channelLayout.awayChannelName;
            }

                ts3core.editChannel(true, value.cid, subName, '', '', '');
        });

    }).catch(e => {
        console.log(e);
    });

}


const getFreeTeams = () => {
    //Find all the Teams that are Free
    Teams.find({status: 'FREE'}).then((teams) => {
            return teams;
        })
    .catch(e => {
        console.log(e);
    });
}


const freeUpChanels = () => {

    Teams.find().then((teams) => {
        teams.forEach(team => {
            
            if (team.status == 'OK' ) { //TODO: Add Time Check

                //Get the First Letter of the Area Name
                gameArea.findOne({areaId: team.gameArea})
                .then((area) => {
                    if (!area) {
                       console.log('Area Not Found!');
                    } 

                    //Make the Name of the Channel
                    let channelNameFree = '[cspacer' + team.spacerNumber + ']' + area.areaName[0] + team.channelOrder + ' - ★ ' + apiSettings.channelLayout.freeSpacerName + ' ★'

                    //Edit Channel to set the New Name
                    ts3core.editChannel(false, team.mainChannelId, channelNameFree, '', '', '')
                    .then(() => console.log('Name Channel changed!'))
                    .catch((e) => {
                        console.log('Error', e);
                    });
                })
                .catch((e) => {
                    console.log('Error', e);
                });

                //Make all the SubChannels Private
                ts3.setSubChannelsPrivate(team.mainChannelId)

               
                //Set channel free in the database.
                Teams.findByIdAndUpdate(
                    team._id,
                    { $set: { serverGroupId: null, teamName: 'FREE CHANNEL', members: [] } })
                .then((todo) => {
                    if (!todo) { 
                        console.log('Error', todo);
                    }
                    console.log('Sucess', todo);
            
                }).catch((e) => {
                    console.log('Error', e);
                });
            }
        });
    }, (e) => {
        console.log('Data Could not be retrived:', e)
    })
    .catch(e => {
        console.log(e);
    });
}


module.exports = {
    createGroupOfChannels,
    createTeam,
    setSubChannelsPrivate,
    setSubChannelsPublic,
    getFreeTeams,
    freeUpChanels
};

// ts3core.getClidFromUid('smgDpLgFrZmV2FrK/PwWvFCA2Pw=')
// .then((data) => {
//     console.log(data)
// })
// .catch((e) => {
//     console.log(e)
// })

// ts3core.getUidFromDbid('2')
// .then((data) => {
//     console.log(data)
// })
// .catch((e) => {
//     console.log(e)
// })