const mongoose= require("mongoose");
const availableSlotSchema= new mongoose.Schema({
    date:{type: String, required: true},
    timeSlot:{
        type:String, required:true}
    },{
        timestamps:true
    }
)

const AvailableSlot= mongoose.model("AvailableSlot", availableSlotSchema);
module.exports= AvailableSlot;