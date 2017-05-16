const express = require('express');
const dataRows = require('./data.json');

//////////////// Wordsmith
const API_KEY = '306d76b55e87c6a488c06beba9e123791635c0051140fd9f88298f8dc40b428d'
const USER_AGENT = 'Wordsmith App Studio'
const wordsmith = require('wordsmith-node-sdk')(API_KEY, USER_AGENT)

const projectSlug = 'ws-app-studio'
const templateSlug = 'master-layout'
let template

wordsmith.projects.find(projectSlug)
  .then(project => {
    return project.templates.find(templateSlug);
  })
  .then(temp => template = temp)
  .catch(error => {
    throw new Error('Error connecting to WS API:' + error.message)
  })

/////////////// Express

const Server = express()

//Middleware

//Add headers for posting
Server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'null') //TODO change to our website

  // Request methods  to allow
  res.setHeader('Access-Control-Allow-Methods', 'POST')

  // Request headers to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Pass to next layer of middleware
  next()
})

Server.get('/', function(req, res){
  // Pick random row
  // Send to wordsmith
  // Respond w/ Wordsmith jasonette
  const random = Math.floor(Math.random() * 16);
  console.log(random)
  const data = dataRows[random];

  template.generate(data)
    .then(content => {
      console.log('result', content)
      res.send(content)
    })
    .catch(error => {
      console.log('error', error.message)
      res.status(400)
      res.send('Sorry, there was an error generating your content. Please try again.')
    })
});

Server.listen(3000);
