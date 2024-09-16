const { default: Expo } = require('expo-server-sdk');
const TestController = {
    index: (req, res, next) => {
        res.json({
            a: 1,
            b: 2
        })
    },
    pushNotification: async (req, res, next) => {
        const body = req.body
        const expo = new Expo({accessToken: process.env.EXPO_ACCESSTOKEN, useFcmV1: true})
        const message = {
            to: "ExponentPushToken[TdUSBLFvm6y1ZVPKxHMf5b]", // Replace with a valid push token from your app
            title: "CMS Tikluy Thông báo",
            body: "Khách hàng LÂM ĐZAI đã tạo lệnh rút 100.000.000 VNĐ",
            data: { someData: 'Some data to be sent with the notification' }, // Optional data
        };
        // const message2 = {
        //     to: "ExponentPushToken[TdUSBLFvm6y1ZVPKxHMf5b]", // Replace with a valid push token from your app
        //     title: 'My Notification Titleeeeee',
        //     body: 'This is the notification body content',
        //     data: { someData: 'Some data to be sent with the notification' }, // Optional data
        // };
        (async () => {
        try {
            const { tickets, errors } = await expo.sendPushNotificationsAsync([message]);
                // handlePushTicketResponses(tickets);
                // handleErrorResponses(errors);
            } catch (error) {
                console.error('Error sending notifications:', error);
            }
        })();
        res.send("a")
        
        function handlePushTicketResponses(tickets) {
        // Process tickets for successful and failed deliveries
            for (const ticket of tickets) {
                const { status, error } = ticket;
                console.log(`Ticket ${ticket.id}: ${status}`);
                if (error) {
                console.error(`Error (${error.code}): ${error.message}`);
                }
            }
        }
        
        function handleErrorResponses(errors) {
            // Handle errors related to the Expo push notification service
            for (const error of errors) {
                console.error(`Expo server error: ${error}`);
            }
        }
    }
}

module.exports = TestController;