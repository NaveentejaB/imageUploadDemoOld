const express = require("express");
const mongoose = require("mongoose");
const bodyParser =require("body-parser");


mongoose.connect("mongodb://localhost:27017/apparaldb",{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
});
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



const customerSchema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true,
        unique : true
    },
    customerName: String,
    customerImages: {
        type:[String],
        minItems:0,
        maxItems:3
    },//Array of image urls
    customerPhoneNumber: String,
    customerEmail: String,
    customerAssociatedMerchant: [String]
});

const Customer = mongoose.model("Customer", customerSchema);

// To fetch all the Apparels.
app.get("/customers",async (req, res) => {
    try {
        const customers = await Customer.find()
        return res.status(200).json({
            customers: customers,
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message,
            success: false
        })
    }
}); 
  
//to fetch a specific apparel
app.get("/customer/:id",async (req, res) => {
    try {
        const customer = await Customer.findOne({ customerID: parseInt(req.params.id) })
        // if (!apparel) {
        //     return res.status(404).json({
        //         message: "Apparel not found.",
        //         success: false
        //     })
        // }
        return res.status(200).json({
            success: true,
            customer: customer
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        })
    }
});

// To add the new Apparel
// app.post("/addApparel",(req,res)=>{
//     const { id, name, imgUrls ,  } = req.body;
//     const newCustomer = new Customer({
//         customerID: Number,
//         customerName: String,
//         customerImages: [String],//Array of image urls
//         customerSizeDetails: sizeDetailSchema,
//         customerPhoneNumber: String,
//         customerEmail: String
//     });
//     Apparel.findOne({apparelID:id})
//     .then(data => {
//         if(data){
//             return res.status(409).json({
//                 message: "Apparel already exists"
//                 // redirectURL: '/allApparels',
//             });
//         }else{
//             newApparel.save();
//             return res.status(200).json({
//                 message:`Apparel with id ${id} added.`,
//                 apparel:newApparel
//             })
//         }
//     }).catch( err => {
//         return res.status(500).json({
//             error: err.message,
//             success: false
//         })
//     })
// });

// //to edit the apparel details
// app.put("/editApparel/:id",async (req, res) => {
//     try {
//         const oldApparelData = await Apparel.findOne({ apparelID: req.params.id })
//         console.log(savingoldData);
//         const newApparel = {
//             apparelName: req.body.name,
//             imageUrl: req.body.avatarImage,
//             apparelID: req.body.id,
//             apparelMAppid :req.body.MAppid,
//             apparelType:req.body. type,
//             status : req.body.status 
            
//         }
//         const newApparelData = await Apparel.findOneAndReplace({apparelID:req.params.id},newApparel);
//         console.log(newApparelData);
//         const newData = await Apparel.findOne({ apparelID: req.params.id })
//         console.log(newData);
//         return res.status(200).json({
//             success: true,
//             newApparelData: newData,
//             oldApparelData:oldApparelData
//         })
//     } catch (err) {
//         res.status(500).json({
//             error: err.message,
//             success: false
//         })
//     }
// });
// //To delete the Apparel
// app.delete("/apparels/delete/:id",async(req,res)=>{
//     const id =req.params.id;
//     try{
//         const delApparel = await Apparel.findOneAndDelete({apparelID:id});
//         console.log(delApparel);
//         return res.status(200).json({
//             apparel:delApparel,
//             message:`Apparel with id ${id} is deleted.`,
//             success:true
//         })
//     }catch (err) {
//         res.status(500).json({
//             error: err.message,
//             success: false
//         })
//     }
// })



app.listen(3000,(req,res)=>{
    console.log("server running in 3000");
});