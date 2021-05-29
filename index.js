const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cors = require('cors')


// express with bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// express with json
app.use(bodyParser.json());


const Task = require('./database/models/Task');

// list
app.get('/tasks', (request, response) => {
  response.statusCode = 200;
  Task.findAll({ raw: true }).then((tasks) => {
    response.send(tasks);
  });
});

// create 
app.post('/tasks', (request, response) => {
  let { name, isDone } = request.body;
  if (name == undefined || name == null || name == '') {
    response.statusCode = 400;
    response.send({ error: 'Name is null', cause: 'Name cannot be null' });

  } else {
    const tast = {
      name,
      isDone,
    }

    Task.create(tast).then((task) => {
      response.statusCode = 200;
      response.send(task);
    });
  }
});

// get one 
app.get('/task/:id', (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) {
    res.statusCode = 400;
    res.send({ cause: 'Id not informed' });
  } else {
    id = parseInt(id);
    Task.findOne({ where: { id: id } }).then((task) => {
      if (task == undefined || task === null) return res.send(null);
      res.send(task);
    })
  }

});

// edit
app.put('/task/:id', (req, res) => {
  let id = req.params.id;

  if (id == null || id == undefined) {
    res.statusMessage = 400;
    res.send({ cause: 'Id not informed' });
  } else {
    id = parseInt(id);
    Task.findOne(({ raw: true, where: { id: id } })).then(taskToUpdate => {
      if (taskToUpdate == undefined || taskToUpdate === null) {
        res.statusCode = 400;
        return res.send({ "cause": "not found task" });
      } else {
        Object.keys(taskToUpdate).map(key => {
          taskToUpdate[key] = req.body[key];
        });
        taskToUpdate['updatedAt'] = new Date();
        Task.update(taskToUpdate, { where: { id: id } }).then((_) => {
          res.send(taskToUpdate);
        });
      }
    });
  }
});

// delete
app.delete('/task/:id', async (req, res) => {

  console.log('call    ')

  const id = req.params.id;
  const exists = await findTask(id);
  if (!exists) {

    console.log('Error => ');

    res.statusCode = 400;
    return res.send({ error: `Id ${id} not found`, cause: `The id cannot null` });
  }

  const task = {
    deletedAt: new Date(),
  };

  await Task.update(task, { where: { id: id } });
  res.send(task);
});

const findTask = async (id) => {
  try {
    const task = await Task.findOne(({ raw: true, where: { id: id } }));
    if (task == undefined || task === null) {
      return false;
    } else {
      return true;
    }
  }
  catch (error) {
    console.error(error)
    return false;
  }
}

// to heroku
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log('Started server on port 3000'));
