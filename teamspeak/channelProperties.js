const private = {
    channel_flag_permanent: 1,
    channel_codec_quality: 10,
    channel_flag_permanent: 1,
    channel_maxclients: 0,
    channel_maxfamilyclients: 0,
    channel_flag_maxclients_unlimited:  0,
    channel_flag_maxfamilyclients_unlimited: 0,
};


const public = {
    channel_flag_permanent: 1,
    channel_codec_quality: 10,
    channel_flag_permanent: 1,
    channel_maxclients: -1,
    channel_maxfamilyclients: -1,
    channel_flag_maxclients_unlimited:  1,
    channel_flag_maxfamilyclients_unlimited: 1,
};

const apiSettings = {
    
    groups: {
        channelAdmin: 9,
        channelMod: 10,
        channelMember: 11,
        guestChannelGroup: 8,
        serverGroupTemplate: 9
    },

    channelLayout: {
        freeSpacerName: 'Free Channel',
        freeChannelName: '♦ Vaga ♦',
        subChannelName: '● Sala de Convivio',
        awayChannelName: '● AFK/Away',
        spacerBar: '━'
    }
}


module.exports = {
    private,
    public,
    apiSettings
};
