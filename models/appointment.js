const mongoose =require('mongoose')
const {Schema} = mongoose


const appointmentSchema = new Schema({
    message:{
        type:String,
        required:true,
    },
    appointmentDate:{
        type:Date,
        required:true,
    },
    hospital:{
        type:String,
        required:true
    },
    patientID:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    department:{
        type:String,
        required:true
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    isDeclined:{
        type:Boolean,
        default:false
    }
})

const Appointment = mongoose.model('appointment', appointmentSchema)
module.exports = Appointment