var mongoose = require('mongoose');
var Schema = mongoose.Schema;

notificationSchema = new Schema({

    notification_id: Number,
    job_id: Number,
    jobTitle: String,
    companyName: String,
    manager_id: Number,
    message: String,
    date: Date,
    status: {
        type: String,
        enum: ["read", "unread"],
        default: "unread"
    }
}),
    Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;