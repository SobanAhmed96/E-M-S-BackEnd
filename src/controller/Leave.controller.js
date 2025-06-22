import LeaveModel from "../model/Leave.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const leaveController = {
    addLeave: asyncHandler(async (req ,res) => {
        const { employeeID , leaveType ,startDate,endDate ,reason,status} = req.body;

        if([employeeID ,leaveType ,startDate ,endDate ,reason , status].some((field) => !field || field.trim() === "")){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const createLeave = await LeaveModel.create({
            employeeID,
            leaveType,
            startDate,
            endDate,
            reason,
            status
        })

        return res.status(201).json({
            success: true,
            message: "Leave Created Successfully",
            createLeave
        })
    }),
    getLeave: asyncHandler(async (req,res) => {
        const get = await LeaveModel.find();

        if(!get || get.length == 0){
            return res.status(404).json({
                success: false,
                message: "Not Found Leaves"
            })
        }

        return res.status(201).json({
            success: true,
            message: "Get Leave Successfully",
            leave: get
        })
    }),
    deleteLeave:asyncHandler(async (req ,res) => {
        const { id } = req.params;
     
        if(!id){
            return res.status(400).json({
                success: false,
                message: "ID Not Found"
            })
        }

        const find = await LeaveModel.findByIdAndDelete(id);

        return res.status(201).json({
            success: true,
            message: "Delete Leave Successfully"
        })
    }),
    getLeaveById: asyncHandler(async (req, res) => {
  const { id } = req.params;

  const find = await LeaveModel.findById(id)

  if (!find) {
    return res.status(404).json({
      success: false,
      message: "Not Found",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Leave Get Successfully",
    Leave: find, // includes populated employee
  });
}),
updateLeave: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const  { status }  = req.body;

    if(!status){
        return res.status(400).json({
            success: false,
            message:"Status are required"
        })
    }

    const update = await LeaveModel.findByIdAndUpdate(id, { status } , { new: true } );

   return res.status(201).json({
    success: true,
    message: "Leave Update successfully",
    leave:  update
   })
})


}

export default leaveController;