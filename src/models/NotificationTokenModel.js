const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationToken = new Schema({
    token: { type: String, required: true},
    roleId: { type: String, default: "" },
    deviceId: { type: String, default: "" },
    userName: { type: String, default: "" }
}, {
    timestamps: true
})

module.exports = mongoose.model('notificationToken', NotificationToken)