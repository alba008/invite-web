import mongoose, { Schema } from "mongoose";

const PLEDGE_SCHEMA = new Schema(
  {
    eventSlug: { type: String, required: true, index: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

// Helpful for admin sorting/filtering
PLEDGE_SCHEMA.index({ eventSlug: 1, createdAt: -1 });

export default mongoose.models.Pledge || mongoose.model("Pledge", PLEDGE_SCHEMA);
