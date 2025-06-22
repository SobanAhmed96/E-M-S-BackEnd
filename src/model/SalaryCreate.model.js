import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    netSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Bank Transfer", "Cash", "Cheque"],
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Paid","Pending"]
    }
  },
  { timestamps: true }
);

export const Salary = mongoose.model("Salary", salarySchema);
