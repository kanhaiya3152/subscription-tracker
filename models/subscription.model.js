import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,'User name is required'],
    },
    price:{
        type:Number,
        required: [true,'User please you have to pay'],
         min:[0,'Price must be greater than your okaat']
    },
    currency:{
        type:String,
        enum:['INR','USD','EUR'],
        default:'INR',
    },
    frequency:{
        type:String,
        enum:['daily','weekly','monthly','yearly'],
    },
    category:{
        type:String,
        required:true,
        enum:['sports','news','entertainment','technology','finance','politics']
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:['active','cancelled','exptres'],
        default:'active',
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator:(value)=> value <= new Date(), 
            message:'Start date must be in the past',
        }
    },
    renewalDate:{
        type:Date,
        validate:{
            validator:(value)=> {
                return value > this.startDate
            } , 
            message:'Renewal date after the start date',
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
        index:true
    }
},{timestamps:true})

// Auto calculate renewal date if missing
subscriptionSchema.pre('save',function(next){
    if(!this.renewalDate){
        const renewalPeriod = {
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365,
        }
        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency])
    }

    // Auto-update the status if renewal date has passed

    if(this.renewalDate < new Date()){
        this.status = 'expired'
    }

    next()
})

const Subscription = mongoose.model('Subscription',subscriptionSchema)

export default Subscription