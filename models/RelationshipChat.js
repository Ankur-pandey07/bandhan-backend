const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RelationshipChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [MessageSchema],
category: {
  type: String,
  default: "relationship", // kaunsa section
},

status: {
  type: String,
  enum: ["new", "accepted", "closed"],
  default: "new", // 🔔 notification ke liye
},

assignedAdmin: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model(
  "RelationshipChat",
  RelationshipChatSchema
);
