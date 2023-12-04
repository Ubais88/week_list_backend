const weeklist = require("../models/weeklist");
const weekTask = require("../models/weekTask");

const expiryCheck = (creationTime, expiryTime) => {
    console.log(new Date() - creationTime >= expiryTime)
  return new Date() - creationTime >= expiryTime;
};

exports.createweekTask = async (req, res) => {
  try {
    const { week, desc } = req.body;
    let savedweek = await weeklist.find({ _id: week }).populate("tasks");

    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    // checking for week time is over or not
    if (expiryCheck(savedweek[0].createdAt, sevenDays)) {
      const updatedWeek = await weeklist.updateOne({ locked: true });
      return res.status(402).json({
        success: false,
        updatedweek: updatedWeek,
        message: "Time of week list is over create new week list",
      });
    }

    // check for actve week task if 2 or more then return
    const activeTasks = savedweek[0].tasks.filter(
      (task) => task.active === true
    );
    console.log("Active tasks in the active week:", activeTasks.length);
    if (activeTasks.length >= 2) {
      return res.status(404).json({
        success: false,
        activeTasks: activeTasks,
        message: "You have already two active tasks in the week list",
      });
    }

    // if active task is less then 1 then create a new one
    const task = await weekTask.create({ desc });

    // update the new task in the weeklist data and update db
    const updatedweek = await weeklist
      .findByIdAndUpdate(week, { $push: { tasks: task._id } }, { new: true })
      .populate("tasks")
      .exec();
    res.status(200).json({
      success: true,
      updatedweek: updatedweek,
      message: "Task saved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error: error.message,
      message: "week TasK creation failed",
    });
  }
};

exports.updateweekTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { weekId, desc } = req.body;

    let savedweek = await weeklist.find({ _id: weekId });

    // checking for week time is over or not
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (expiryCheck(savedweek[0].createdAt, sevenDays)) {
      if (savedweek[0].locked === true) {
        return res.status(402).json({
          success: false,
          updatedweek: updatedWeek,
          message: "Week is locked",
        });
      }
      const updatedWeek = await weeklist.findByIdAndUpdate(weekId, {
        locked: true,
      });
      return res.status(402).json({
        success: false,
        updatedweek: updatedWeek,
        message: "Time of week list is over create new week list",
      });
    }

    const savedTask = await weekTask.findById({ _id: taskId }, {new :true});
    const oneDay = 24 * 60 * 60 * 1000;
    if (expiryCheck(savedTask.createdAt, oneDay)) {
      return res.status(402).json({
        success: false,
        task: savedTask,
        message: "Update is only allowed within 24hrs from creation",
      });
    }
    const updatedTask = await weekTask.findByIdAndUpdate(taskId, {
      desc: desc,
      updatedAt: new Date(),
    });
    console.log(savedTask.createdAt);
    res.status(200).json({
      success: true,
      savedTask: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error: error.message,
      message: "failed to update week task",
    });
  }
};

exports.updateActiveStatus = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { weekId } = req.body;
    let savedweek = await weeklist.findById({ _id: weekId });
    // checking for week time is over or not
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (expiryCheck(savedweek.createdAt, sevenDays)) {
      const updatedWeek = await weeklist.findByIdAndUpdate(weekId, {
        locked: true,
      });
      return res.status(402).json({
        success: false,
        updatedweek: updatedWeek,
        message: "Time of week list is over create new week list",
      });
    }

    const savedTask = await weekTask.findById({ _id: taskId });
    const oneDay = 24 * 60 * 60 * 1000;
    if (expiryCheck(savedTask.createdAt, oneDay)) {
      return res.status(402).json({
        success: false,
        task: savedTask,
        message: "Update is only allowed within 24hrs from creation",
      });
    }
    const updatedTask = await weekTask.findByIdAndUpdate(taskId ,{
      active: false,
      updatedAt: new Date(),
    });
    res.status(200).json({
      success: true,
      savedTask: updatedTask,
      message: "Task active status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error: error.message,
      message: "failed to update active status",
    });
  }
};

exports.deleteWeekTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { weekId } = req.body;

    let savedweek = await weeklist.find({ _id: weekId });

    // checking for week time is over or not
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (expiryCheck(savedweek[0].createdAt, sevenDays)) {
      if (savedweek[0].locked === true) {
        return res.status(402).json({
          success: false,
          updatedweek: updatedWeek,
          message: "Week is locked",
        });
      }

      const updatedWeek = await weeklist.findByIdAndUpdate(weekId, {
        locked: true,
      });
      return res.status(402).json({
        success: false,
        updatedweek: updatedWeek,
        message: "Time of week list is over create new week list",
      });
    }

    const expiretime = new Date(new Date() - 24 * 60 * 60 * 1000);
    const deletedTask = await weekTask.findByIdAndDelete(taskId, {
      createdAt: { $lt: expiretime },
    });
    if (!deletedTask) {
      return res.status(402).json({
        success: false,
        message: "After 24hrs not possible to delete/update a task",
      });
    }


    const updatedweek = await weeklist.findByIdAndUpdate(weekId ,{
        $pull:{tasks:deletedTask._id}
    } , {new:true})


    res.status(200).json({
      success: true,
      deletedTask: deletedTask,
      updatedWeekTaskref: updatedweek.tasks,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error: error.message,
      message: "failed to delete task",
    });
  }
};

exports.getAllTask = async (req, res) => {
  try {
    const { weekId } = req.body;
    const savedweek = await weeklist.find({ _id: weekId }).populate("tasks");

    res.status(200).json({
        success: true,
        tassks:savedweek[0].tasks,
        message:"Tasks fetched successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error: error.message,
      message: "failed to fetch all tasks",
    });
  }
};


exports.getTask = async(req  , res) => {
    try{
      const taskId = await req.params.taskId;
      const taskDetail = await weekTask.findById({_id: taskId});

      res.status(200).json({
        success: true,
        taskDetails: taskDetail,
        messsage: "task fetched successfully"
      })
    } catch (error) {
      console.log(error);
      res.status(404).json({
        success: false,
        error: error.message,
        message: "failed to fetch tasks details",
      });
    }
}


exports.feed = async(req , res) => {
  try{
    const alltasks = await weekTask.find({ active:true});
    res.status(200).json({
      success:false,
      activeTasks:alltasks,
      message:"All Active Task fetched successfully" 
    })
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error: error.message,
      message: "failed to fetch all active  tasks details",
    });
  }
}