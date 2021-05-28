const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cors = require('cors')


// express with bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// express with json
app.use(bodyParser.json());


const Todo = require('./database/models/Todo');

// list
app.get('/todos', (request, response) => {
  response.statusCode = 200;
  Todo.findAll({ raw: true }).then((todos) => {
    response.send(todos);
  });
});

// create 
app.post('/todo', (request, response) => {
  let { name, isDone } = request.body;

  console.log(request.body);
  if (name == undefined || name == null || name == '') {
    response.statusCode = 400;
    response.sendStatus(400);

  } else {
    Todo.create({ name, isDone }).then((todo) => {
      response.statusCode = 200;
      response.send(todo);
    });
  }
});

// get one 
app.get('/todo/:id', (request, response) => {
  let id = request.params.id;
  if (isNaN(id)) {
    response.sendStatus(400);
  } else {
    id = parseInt(id);
    Todo.findOne({ where: { id: id } }).then((todo) => {
      response.sendStatus(200);

      if (todo == undefined || todo === null) return response.send(null);
      response.send(todo);
    })
  }

});

// edit
app.put('/todo/:id', (request, response) => {
  const id = request.params.id;
  if (isNaN(id)) {
    response.statusMessage = 400;
    response.send({ cause: 'Id not informed' });
  } else {
    id = parseInt(id);
    Todo.findOne({ where: { id: id } }).then((todo) => {
      response.sendStatus(400);

      if (todo == undefined || todo === null) return response.send(null);
      response.send(todo);
    });
  }
});

// delete
app.delete('/todo/:id', (req, res) => {

});

// to heroku
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log('Started server on port 3000'));
