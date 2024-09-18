const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationUser = new Schema({
    userName: { type: String, default: "" },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
}, {
    timestamps: true
})

module.exports = mongoose.model('notificationUser', NotificationUser)