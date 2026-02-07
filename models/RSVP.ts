import mongoose, { Schema } from "mongoose";

const RSVP_SCHEMA = new Schema(
  {
    eventSlug: { type: String, required: true, index: true, trim: true },
    fullName: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ["ACCEPT", "DECLINE", "MAYBE"],
      required: true,
      uppercase: true,
      trim: true,
    },

    guests: { type: Number, default: 0, min: 0, max: 20 },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

// Admin speed
RSVP_SCHEMA.index({ eventSlug: 1, createdAt: -1 });

// OPTIONAL (choose one):
// If you want to PREVENT duplicate RSVP spam for same name+event:
// RSVP_SCHEMA.index({ eventSlug: 1, fullName: 1 }, { unique: true });

export default mongoose.models.RSVP || mongoose.model("RSVP", RSVP_SCHEMA);
