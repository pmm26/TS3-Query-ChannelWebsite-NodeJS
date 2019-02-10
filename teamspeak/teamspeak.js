const TeamspeakQuery = require('teamspeak-query');
let _ = require('lodash');

var channel = require('./channelProperties.js'); //Objext that contains all the default properties to create a channel
 
const query = new TeamspeakQuery('37.59.63.90', 10011);

//ServerQuery serveradmin j6FU5o4F
const loginData = ['serveradmin', 'j6FU5o4F'];


let login = () => {
    return query.send('login', loginData[0], loginData[1])
           .then(() => query.send('use', 1))
};

let ts3 = login();

/**
 * Create channel
 * 
 * @public          boolean     Choose between public of private channel
 * @name:           String      Client DB ID
 * @password        String      Channel Password
 * @topic           String      Channel Topic
 * @description     String      Channel Description
 * @subChannel      int         Sub Channel ID (Not Required)
 * @channelOrder    int         Order of the Channel (Not Required)
 */
const createChannel = (public, name, password, topic, description, subChannel, channelOrder) => {

    subChannel = parseInt(subChannel);
    channelOrder = parseInt(channelOrder);

    if ((_.isString(name)) & (_.isBoolean(public))) {

         //Set the channel Plublic or Private
        let params = { ...channel.public };
        !public ? params = { ...channel.private } : null;
        
        //Add the data into the object
        params.channel_name = name;
        !_.isEmpty(password) ? params.channel_password = password : null;
        !_.isEmpty(topic) ? params.channel_topic = topic : null;
        !_.isEmpty(description) ? params.channel_description = description : null;

        _.isInteger(subChannel) ? params.cpid = subChannel : null;
        _.isInteger(channelOrder) ? params.channel_order = channelOrder : null;

    
        return ts3.then(() => query.send("channelcreate", params))
            .then(data => {console.log('Channel Created!');
                            return data.cid; })
            .catch(err => console.error('createChannel error:', err));

    } else {
        console.log('createChannel: Invalid Input');
    }
}




/**
 * Edit channel
 * 
 * @public          boolean     Choose between public of private channel
 * @cid             int         Source Server Group ID
 * @name            String      Client DB ID
 * @password        String      Channel Password
 * @topic           String      Channel Topic
 * @description:    String      Channel Description
 */
const editChannel = (public, cid, name, password, topic, description) => {

    cid = parseInt(cid);

    if ((_.isBoolean(public)) & (_.isInteger(cid))) {
        
        //Set the channel Plublic or Private
        let params = { ...channel.public };
        !public ? params = { ...channel.private } : null;

       //Ternary Operator Works like an If Statement
        params.cid = cid;
        
        // If this is True ?  Executar isto : Se nao for fazer isto
        !_.isEmpty(name) ? params.channel_name = name : null;
        !_.isEmpty(password) ? params.channel_password = password : null;
        !_.isEmpty(topic) ? params.channel_topic = topic : null;
        !_.isEmpty(description) ? params.channel_description = description : null;


        //TODO: maybe add a way to see if the method as successful by returning true
        return ts3.then(() => query.send("channeledit", params))
            .then(() => console.log('Channel Edited!'))
            .catch(err => {
                //If The Error was Channel Name Already in use then Remove the Name and try again
                if (parseInt(err.id) == 771) {
                    
                    delete params.channel_name;

                    return ts3.then(() => query.send("channeledit", params))
                        .then(() => console.log('Channel Edited!'))
                        .catch(e => {
                            console.log(e);
                        });
                } else {
                    console.log('Deu Merda a Criar Canal')
                }
                      
            });


    } else {
        console.log('editChannel: Invalid Input');
    }
};

const deleteChannel = (cid) => {

    cid = parseInt(cid);
    
    if ((_.isInteger(cid))) {

        let params = {
            cid: cid
        };

        return ts3.then(() => query.send("channeldelete", params))
            .then((data) => {console.log('Channel Deleted!')
                            return data.sgid})
            .catch(err =>  console.error('deleteChannel error:', err));

    } else {
        console.log('deleteChannel: Invalid Input');
    }
     
};



/**
 * Copy a server group
 * 
 * @ssgid:      int      Source Server Group ID
 * @name:       String   Client db ID
 */
const serverGroupCopy = (ssgid, name) => {

    ssgid = parseInt(ssgid);
    
    if ((_.isInteger(ssgid)) & (_.isString(name))) {

        let params = {
                ssgid: ssgid,
                name: name,
                tsgid: 0,
                type: 1
        };

        return ts3.then(() => query.send("servergroupcopy", params))
            .then((data) => {console.log('Server Group Copied!')
                            return data.sgid})
            .catch(err =>  console.error('serverGroupCopy error:', err));

    } else {
        console.log('serverGroupCopy: Invalid Input');
    }
};


/**
 * Set Server Group to user
 * 
 * @sgid:       int    Server group id
 * @cldbid:     int     Client db id
 */
const setServerGroup = (sgid, cldbid) => {

    sgid = parseInt(sgid);
    cldbid = parseInt(cldbid);

    if ((_.isInteger(sgid)) & (_.isInteger(cldbid))) {

        let params = {
            sgid: sgid,
            cldbid: cldbid
        };

        return ts3.then(() => query.send("servergroupaddclient", params))
            .then(() => console.log('Server Group Set!'))
            .catch(err => console.error('setServerGroup error:', err));

    } else {
        console.log('setServerGroup: Invalid Input');
    }
};


/**
 * Set Channel Group to user
 * 
 * @cgid:       int    Channel Group ID
 * @cid:        int    Channel ID
 * @cldbid:     int    Client db ID
 */
const setChannelGroup = (cgid, cid, cldbid) => {

    cgid = parseInt(cgid);
    cid = parseInt(cid);
    cldbid = parseInt(cldbid);

    if ((_.isInteger(cgid)) & (_.isInteger(cid)) & (_.isInteger(cldbid))) {

        let params = {
                cgid: cgid,
                cid: cid,
                cldbid: cldbid
        };

        return ts3.then(() => query.send("setclientchannelgroup", params))
            .then(() => console.log('Channel Group Set!'))
            .catch(err => console.error('setChannelGroup error:', err));

    } else {
        console.log('setChannelGroup: Invalid Input');
    }
};


/**
 * Get Clid From cluid
 * 
 * @cldbid:     int    Client db ID
 */
const getUidFromDbid = (cldbid) => {
    
    cldbid = parseInt(cldbid);

    if ((_.isNumber(cldbid))) {

        let params = {
            cldbid: cldbid
        };

        return ts3.then(() => query.send("clientgetnamefromdbid", params))
            .then(data => { 
                return data.cldbid; 
            })
            .catch(err => console.error('moveClient error:', err));

    } else {
        console.log('moveClient: Invalid Input');
    }
};


/**
 * Get Clid From cluid
 * 
 * @uid:       String    User Unique Identifier
 */
const getClidFromUid = (uid) => {

      
    if ((_.isString(uid))) {

        let params = {
            cluid: uid
        };

        return ts3.then(() => query.send("clientgetids", params))
            .then(data => { 
                if (_.isArray(data.clid)) {
                    return data.clid[0];
                }
                
                return data.clid; 
            })
            .catch(err => console.error('moveClient error:', err));

    } else {
        console.log('moveClient: Invalid Input');
    }
};


/**
 * Get dbid From cluid
 * 
 * @uid:       String    User Unique Identifier
 */
const getCldbidFromUid = (uid) => {

      
    if ((_.isString(uid))) {

        let params = {
            cluid: uid
        };

        return ts3.then(() => query.send("clientgetdbidfromuid", params))
            .then(data => { 
                return data.cldbid; 
            })
            .catch(err => console.error('moveClient error:', err));

    } else {
        console.log('moveClient: Invalid Input');
    }
};

/**
 * Move user to new channel
 * 
 * @uid:       String    User Unique Identifier
 * @cid:        int    Channel ID
 */
const moveClient = (uid, cid) => {
    
    cid = parseInt(cid);


    if ((_.isString(uid)) & (_.isInteger(cid))) {


        return getClidFromUid(uid)
        .then((clid) => {

            let params = {
                    clid: clid,
                    cid: cid
            };

            return ts3.then(() => query.send("clientmove", params))
                .then(() => console.log('Client Moved!'))
                .catch(err => console.error('moveClient error:', err));
            
        })
        .catch(err => console.error('moveClient error:', err));

        } else {
            console.log('moveClient: Invalid Input');
        }
   
};

/**
 * Get Array of SubChannels
 * 
 * @cid:        int    Channel ID
 */
const subChannelList = (cid) => {

    cid = parseInt(cid);

    if ((_.isInteger(cid))) {

        let channels = [];

        //TODO: maybe add a way to see if the method as successful by returning true
        return ts3.then(() => sendList('channellist -topic -flags -voice -limits -icon'))
            .then((data) => {
                data.forEach(subChannel => {
                    if (subChannel['pid'] == cid) {
                        channels.push(subChannel);
                    }
                });
                return channels;
            })
            .catch(console.error);
    
    } else {
        console.log('subChannelList: Invalid Input');
    }
}


/**
 * For data commands like channellist, clientlist
 * Parse Data into Object
 */
const parseList = (data) => {
    return data.raw()
      .split('|')
      .map(TeamspeakQuery.parse)
      .map(entry => entry.params)
      .map(entry => {
        delete entry.raw;
        return entry;
      });
}


/**
 * For data commands like channellist, clientlist
 * Execute command
 */
function sendList() {
    return query.send.apply(query, Array.from(arguments)).then(parseList);
}



/**
 * 
 * TEST AREA
 * 
 */



module.exports = {
    createChannel,
    editChannel,
    serverGroupCopy,
    setServerGroup,
    setChannelGroup,
    setChannelGroup,
    moveClient,
    getClidFromUid,
    getUidFromDbid,
    getCldbidFromUid,
    subChannelList
};


