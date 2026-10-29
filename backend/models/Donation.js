const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    donationType: {
      type: String,
      required: true,
      enum: ["food", "clothing", "money", "education", "medical"],
    },
    amount: { type: Number },
    note: { type: String, default: "" },
    paymentId: { type: String },
    orderId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
