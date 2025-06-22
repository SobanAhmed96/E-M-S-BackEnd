import { Salary } from "../model/SalaryCreate.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const SalaryController = {
  createSalary : asyncHandler(async ( req ,res) => {
    const {
      employee,
      basicSalary,
      allowances,
      deductions,
      paymentDate,
      paymentMode,
      status
    } = req.body;

    if(!employee || !basicSalary || !allowances || !deductions || !paymentDate || !paymentMode || !status) {
      return res.status(400).json({
        message: "Required fields are missing."
      })
    }

    const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

    if(!netSalary){
       return res.status(400).json({
        message: "Required fields are missing."
      })
    }

    
    const createSalaryDB = await Salary.create({
      employee,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      paymentDate,
      paymentMode,
      status
    })

    return res.status(201).json({
      success: true,
      message: "Salary Created Successfully",
      data: createSalaryDB
    })
  }),
  getsalaries: asyncHandler(async (req ,res) => {
    const find = await Salary.find();

    if(!find || find.length === 0){
      return res.status(404).json({
        success: false,
        message: "Not Found"
      })
    }

    return res.status(201).json({
      success: true,
      message: "Get Salaries Successfully",
      data: find
    })
  }),
 getsalariesByID: asyncHandler(async (req, res) => {
  const { id } = req.params;

  const find = await Salary.findById(id);
  if (!find) {
    return res.status(404).json({
      success: false,
      message: "Not Found"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Successfully",
    data: find
  });
}),

  updateSalary: asyncHandler(async (req ,res) => {
    const {id} = req.params
    const {
      employeeID,
      basicSalary,
      allowances,
      deductions,
      paymentDate,
      paymentMode,
      status
    } = req.body;

        if(!employeeID || !basicSalary || !allowances || !deductions || !paymentDate || !paymentMode || !status){
      return res.status(400).json({
        message: "Required fields are missing."
      })
    }

    const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

     if(!netSalary){
       return res.status(400).json({
        message: "Required fields are missing."
      })
    }

    const update = await Salary.findByIdAndUpdate(id , { employeeID ,basicSalary, allowances, deductions ,netSalary , paymentDate, paymentMode, status }, { new: true });

    return res.status(201).json({
      success: true,
      message: "Salary Update successfully",
      data: update
    })
  }),
  deleteSalary: asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedSalary = await Salary.findByIdAndDelete(id);

  if (!deletedSalary) {
    return res.status(404).json({
      success: false,
      message: "Salary record not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Salary record deleted successfully.",
    data: deletedSalary,
  });
}),

}

export default SalaryController;