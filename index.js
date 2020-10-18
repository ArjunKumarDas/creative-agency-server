const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.on0y8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('admin'));
app.use(fileUpload());
const port = 5000

app.get('/', (req, res) => {
  res.send('Creative Agency DataBase Website')
})

client.connect(err => {
  const workCollection = client.db("creativeAgency").collection("userInfo");
 // review
//  app.post('/addReview', (req, res) => {
//    const newReview = req.body;
//    workCollection.insertOne(newReview)
//     .then(results => {
//       res.send(results.insertedCount > 0)
//     })
//  }),

// Customer From api
  app.post('/addWork', (req, res) =>{
    const work = req.body;
    workCollection.insertOne(work)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  }),
  // review page api 
  // app.post('/addReview', (req, res) =>{
  //   const review = req.body;
  //   workCollection.insertOne(review)
  //   .then(result => {
  //     res.send(result.insertedCount > 0)
  //   })
  // }),
//add service api
  app.post('/addService', (req, res) =>{
    const file = req.files.file;
    const name = req.body.name;
    const about = req.body.about;
    console.log(file, name, about);
   
    file.mv(`${__dirname}/admin/${file.name}`, err => {
      if(err){
        console.log(err);
        return res.status(500).send({messg: 'Failed to upload file'});
      }
      return res.send({name: file.name, path: `/${file.name}`})
    })
  })

app.get('/user', (req, res) => {
  workCollection.find({})
    // workCollection.find({email: req.query.email})
  .toArray((err, documents) => {
    res.send(documents);
  })
})


 app.get('/allUser', (req, res) => {
  workCollection.find({})
  .toArray((err, documents) => {
   res.send(documents);
  })
 })


});

app.listen(process.env.PORT || port)


