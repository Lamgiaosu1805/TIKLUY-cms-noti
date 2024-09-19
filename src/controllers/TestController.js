const { default: Expo } = require('expo-server-sdk');
const NotificationTokenModel = require('../models/NotificationTokenModel');
const NotificationUserModel = require('../models/NotificationUserModel');
const TestController = {
    index: (req, res, next) => {
        res.json({
            a: 1,
            b: 2
        })
    },
    pushNotification: async (req, res, next) => {
        const body = req.body
        try {
            let expo = new Expo({
                accessToken: process.env.EXPO_ACCESS_TOKEN,
                /*
                 * @deprecated
                 * The optional useFcmV1 parameter defaults to true, as FCMv1 is now the default for the Expo push service.
                 *
                 * If using FCMv1, the useFcmV1 parameter may be omitted.
                 * Set this to false to have Expo send to the legacy endpoint.
                 *
                 * See https://firebase.google.com/support/faq#deprecated-api-shutdown
                 * for important information on the legacy endpoint shutdown.
                 *
                 * Once the legacy service is fully shut down, the parameter will be removed in a future PR.
                 */
                useFcmV1: true,
            });
              
            // Create the messages that you want to send to clients
            let messages = [];
            const notification = []
            const listTokenModel = await NotificationTokenModel.find()
            const somePushTokens = listTokenModel.map(item => {
                return {
                    token: item.token,
                    username: item.userName
                }
            })
            for (let pushToken of somePushTokens) {
                // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
                
                // Check that all your push tokens appear to be valid Expo push tokens
                if (!Expo.isExpoPushToken(pushToken.token)) {
                    console.error(`Push token ${pushToken.token} is not a valid Expo push token`);
                    continue;
                }
                
                // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
                messages.push({
                    to: pushToken.token,
                    title: 'Quản trị TIKLUY',
                    sound: 'default',
                    body: body.content,
                    data: { withSome: 'data' },
                })
                const indexItem = notification.findIndex(e => e.userName == pushToken.username)
                if(indexItem == -1) {
                    notification.push({
                        userName: pushToken.username,
                        title: "Quản trị TIKLUY",
                        content: body.content
                    })
                }
            }
            await NotificationUserModel.insertMany(notification)
            
            // The Expo push notification service accepts batches of notifications so
            // that you don't need to send 1000 requests to send 1000 notifications. We
            // recommend you batch your notifications to reduce the number of requests
            // and to compress them (notifications with similar content will get
            // compressed).
            let chunks = expo.chunkPushNotifications(messages);
            let tickets = [];
            (async () => {
            // Send the chunks to the Expo push notification service. There are
            // different strategies you could use. A simple one is to send one chunk at a
            // time, which nicely spreads the load out over time:
                for (let chunk of chunks) {
                    try {
                        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                        console.log(ticketChunk);
                        tickets.push(...ticketChunk);
                        // NOTE: If a ticket contains an error code in ticket.details.error, you
                        // must handle it appropriately. The error codes are listed in the Expo
                        // documentation:
                        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                    } catch (error) {
                        console.error(error);
                    }
                }
            })();
            res.json({
                status: true,
                message: 'Sent Notification'
            })
        } catch (error) {
            res.json({
                status: false,
                message: "Send notification has Failure"
            })
            console.log(error)
        }
        
    },
    saveToken: async (req, res) => {
        const {body} = req
        try {
            const notificationToken = await NotificationTokenModel.findOneAndUpdate({token: body.token}, body)
            if(notificationToken) {
                // NotificationTokenModel.updateOne({userName: body.userName})
            }
            else {
                const newToken = new NotificationTokenModel({
                    token: body.token,
                    deviceId: body.deviceId,
                    userName: body.userName,
                    roleId: body.roleId
                })
                await newToken.save()
            }
            res.json({
                status: true,
                message: "save token successful"
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: false,
                message: "Lỗi save token"
            })
        }
    },
    getListNotiUser: async(req, res) => {
        const {body, params, query} = req
        try {
            const listNotiUser = await NotificationUserModel.find({userName: query.userName}).sort({ createdAt: 'descending' }).limit(20)
            res.json({
                status: true,
                data: listNotiUser
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: false,
                message: "Get noti thất bại"
            })
        }
    }
}

module.exports = TestController;