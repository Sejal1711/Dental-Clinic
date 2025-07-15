const mongoose= require("mongoose");
const bcrypt= require("bcryptjs");
const admin= new mongoose.Schema({
    email:{type:String, required:true},
    password:{type:String, required:true}
},
{timestamps:true

});
admin.pre("save", async function (next) {
    if(!this.isModified("password"))
        return next();
    this.password= bcrypt.hash(this.password,10);
    next();
})
admin.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const Admin= mongoose.model("Admin", admin );
mongoose.exports= Admin;
