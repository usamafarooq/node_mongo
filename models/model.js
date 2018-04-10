var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
    name: String,
    date: Date,
    type: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);