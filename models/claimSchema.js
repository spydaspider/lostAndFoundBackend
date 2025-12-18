const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClaimSchema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },

    claimant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    answerProvided: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', ClaimSchema);
