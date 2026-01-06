const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Phone',
        'Laptop',
        'Wallet',
        'Keys',
        'ID Card',
        'Bag',
        'Headphones',
        'Other'
      ]
    },

    locationText: {
      type: String,
      required: true
    },

    imageUrl: {
      type: String,
      required: true
    },

    verificationQuestion: {
      type: String,
      required: true
    },

    verificationAnswerHash: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ['open', 'claimed', 'closed'],
      default: 'open'
    },

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);
