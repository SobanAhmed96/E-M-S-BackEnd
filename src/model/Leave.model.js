import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      required: true,
    },

    leaveType: {
      type: String,
      enum: ["Sick", "Casual", "Earned", "Unpaid", "Maternity", "Paternity"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
