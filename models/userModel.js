const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:function(){
            if(this.role === 'donner' || this.role === 'admin'){
                return true
            }
            return false
        }
    },
    role:{
        type:String,
        required: [true,'Role is required'],
        enum:['admin','donner','organisation','hospital'],
    },
    organisationName:{
        type:String,
        required:function(){
            if(this.role == 'organisation'){
                return true
            }
            return false
        }
    },
    hospitalName:{
        type:String,
        required:function(){
            if(this.role === 'hospital'){
                return true
            }
            return false
        }
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"password is requierd"],
    },
    website:{
        type:String,
    },
    address:{
        type:String,
        required:[true,"address is required"],
    },
    phone:{
        type:String,
        required:[true,"Phone number is required"],
    }
},{timestamps:true});

module.exports = mongoose.model('users',userSchema);