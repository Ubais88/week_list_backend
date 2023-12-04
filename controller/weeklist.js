const WeekList  = require('../models/weeklist')

exports.weeklist = async(req , res) => {
    try{
        const { weekname , user } = req.body;

        if(!weekname){
            return res.status(404).json({
                success:false,
                message:"WeekName not found"
            })
        }

        const savedWeek = await WeekList.create({weekname , user})

        res.status(200).json({
            success:true,
            weekData: savedWeek,
            message:"WeekList saved successfully"
        })
    }
    catch(error){
        console.log(error);
        res.status(404).json({
            success: false,
            error: error.message,
            message: "Error while creating a new week list"
        })
    }
}