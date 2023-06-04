// Import required dependencies
const mongoose = require('mongoose') 
const shortId = require('shortid') 

// Define the Short URL schema
const shortUrlSchema= new mongoose.Schema({
  full:{
    type: String,
    required: true
  },
  short:{
    type: String,
    required: true,
    default: ()=> shortId.generate()
  },
  clicks:{
    type: Number,
    required: true,
    default: 0
  }
}) 


// Create and export the ShortUrl model based on the schema
module.exports=mongoose.model('shortUrl',shortUrlSchema);