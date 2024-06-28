// const sizeDetailSchema = new mongoose.Schema({
//     neck: Number,
//     back: Number,
//     shoulder: Number,
//     length: Number,
//     waist: Number,
//     chest: Number,
//     sleeve: Number,
//     hip: Number,
//     inseam: Number,
//     thigh: Number,
//     calf: Number,
//     ankle: Number,
//     // Add more size details as needed
// });

var customerOutputImagesSchema = new mongoose.Schema({
    name:String,
    type:String,
    expiresAt:Date.now()+60*1000
})

outputImgSchema.index({ createdAt: 1 }, { expireAfterSeconds: 518400 }); //expire after 6 days

const customerSchema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true,
        unique : true
    },
    customerName: String,
    customerOutputImages : [customerOutputImagesSchema]
});