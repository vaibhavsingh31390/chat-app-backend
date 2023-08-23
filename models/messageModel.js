const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    message: {
      type: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
    recipient_type: {
      type: String,
      required: true,
    },
    users: Array,
    from: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      username: {
        type: String,
        required: this.translateAliases,
      },
    },
    to: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      username: {
        type: String,
        required: this.translateAliases,
      },
    },
    status: {
      type: String,
      default: 'sent',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", messageSchema);
