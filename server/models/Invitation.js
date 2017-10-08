const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invitationSchema = new Schema({
  username: String,
  collegiate: String,
  speciality: String,
  name: String,
  phone: Number,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Invitation = mongoose.model('Invitation', invitationSchema);
module.exports = Invitation;
