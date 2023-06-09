// In the context of web development, a view engine is a template engine that allows you to generate dynamic 
//HTML pages by combining static HTML markup with dynamic data. It provides a way to structure and render 
//the views of your application.

// EJS (Embedded JavaScript) is one of the popular view engines in the Node.js ecosystem.
// It allows you to embed JavaScript code directly within your HTML templates, enabling you 
//to dynamically generate content based on the data received from the server.

// When you set the view engine to EJS using `app.set('view engine', 'ejs')`, 
//you are configuring your Express application to use EJS as the default view engine. 
//This means that when you render a view using `res.render()`, Express will automatically 
//look for EJS templates and process them to generate the final HTML that will be sent to the client.

// Setting the view engine to EJS enables you to use EJS syntax and features in your views, 
//such as embedding JavaScript code, including partials, conditionals, loops, and more. 
//It provides a convenient way to create dynamic and reusable templates for your web application.



// Required modules and dependencies
const express = require('express');
const app = express(); 
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl.js')


require('dotenv').config(); // Load environment variables from .env file


// Connection URI for MongoDB Atlas
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



// Set the view engine to EJS
app.set('view engine', 'ejs'); 

// Middleware to parse request body as URL-encoded data
app.use(express.urlencoded({extended:false}))

// Handle GET request to the root URL ("/") and render the "index" view
app.get('/', async (req, res) => { 
   // Retrieve all short URLs from the database
   const shortUrls= await ShortUrl.find();
  res.render('index',{shortUrls:shortUrls});
}); 


// Handle POST request to "/shortUrls" and create a new short URL in the database
app.post('/shortUrls',async (req,res)=>{
await ShortUrl.create({full:req.body.fullUrl})
  res.redirect('/')
})


// Handle GET request to a short URL and redirect to the corresponding full URL
app.get('/:shortUrl',async (req,res)=>{
   // Find the short URL in the database based on the provided parameter
  const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})

   // Short URL not found, return 404 status
  if(shortUrl==null) return res.sendStatus(404) 
  // Increment the clicks count and save the updated short URL

  shortUrl.clicks++;
  shortUrl.save();
  // Redirect to the full URL associated with the short URL
  res.redirect(shortUrl.full)
})


// Start the server and listen for incoming requests
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port 5000');
});
