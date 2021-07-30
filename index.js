const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cors = require('cors')


// express with bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// express with json
app.use(bodyParser.json());


// const Task = require('./database/models/task');
// const User = require('./database/models/user');
// const { Author, Book } = require('./database/models/author-book');
// cosnt TTTask = require('./database/models/author-book')
const models = require('./database/models')

// list
app.get('/tasks', async (request, response) => {
  response.statusCode = 200;
  try {
    const tasks = await Task().findAll({ raw: true })
    response.send({ tasks });
  } catch (error) {
    response.statusCode = 500;
    response.send({ error: error });

  }
});

// create 
app.post('/tasks', async (request, response) => {
  let { name, isDone, userId } = request.body;

  if (userId == undefined || userId == null || userId == '') {
    response.statusCode = 400;
    response.send({ title: 'User cannot be null', cause: 'The userId not informed' });
  }

  if (name == undefined || name == null || name == '') {
    response.statusCode = 400;
    response.send({ title: 'Name is null', cause: 'Name cannot be null' });
  } else {
    const taskToCreate = {
      name,
      isDone,
      userId
    }
    try {
      const task = await Task().create(taskToCreate);
      response.statusCode = 200;
      response.send(task);
    } catch (error) {
      response.statusCode = 500;
      response.send({ error });
    }

  }
});

// get one 
app.get('/task/:id', async (req, response) => {
  let id = req.params.id;
  if (id == null || id == undefined) {
    response.statusCode = 400;
    response.send({ cause: 'Id not informed' });
  } else {

    try {
      const task = await Task().findOne({ where: { id: id } });
      console.log('task => ', task)
      // if (task == undefined || task === null) return response.send(null);
      response.send(task);
    } catch (error) {
      console.log('error => ', error)

      response.statusCode = 500;
      response.send({ title: 'Task not found!', cause: '' });
    }
  }
});

// Get all tasks by User
app.get('/user/:id/tasks', async (req, response) => {
  let id = req.params.id;
  if (!validateId(id)) {
    return sentInvalidId(response, `The id=${id} is null or undefined`);
  }
  try {
    const userTasks = await models.user.findOne({ where: { id: id }, include: [models.task] });
    return response.send(userTasks);
  } catch (error) {
    console.log('error =>', error)
    response.statusCode = 400;
    return response.send({ "cause": "not found task" });
  }


});

// ============================================================================
// Get all tasks by User
// app.get('/test/:id/tasks', async (req, response) => {
//   let id = req.params.id;
//   if (!validateId(id)) {
//     return sentInvalidId(response, `The id=${id} is null or undefined`);
//   }
//   try {
//     console.log('models =>', models)
//     const tasks = await models.author.findAll({ include: [models.Book] });
//     response.send(tasks);
//   } catch (error) {
//     console.log('error =>', error)
//     response.statusCode = 400;
//     return response.send({ "cause": "not found task" });
//   }

// });
// ============================================================================

// edit
app.put('/task/:id', async (req, response) => {
  let id = req.params.id;

  if (id == null || id == undefined) {
    response.statusMessage = 400;
    response.send({ cause: 'Id not informed' });
  } else {
    try {
      let taskToUpdate = await Task().findOne({ where: { id: id }, raw: true });

      if (taskToUpdate == undefined || taskToUpdate === null) {
        response.statusCode = 400;
        return response.send({ "cause": "not found task" });
      }

      Object.keys(taskToUpdate).map(key => taskToUpdate[key] = req.body[key]);
      taskToUpdate['updatedAt'] = new Date();
      await Task().update(taskToUpdate, { where: { id: id } });
      response.send(taskToUpdate);

    } catch (error) {
      console.log('error =>', error)
      response.statusCode = 400;
      return response.send({ "cause": "not found task" });
    }
  }
});

// delete
app.delete('/task/:id', async (req, response) => {
  const id = req.params.id;
  const exists = await findTask(id);
  if (!exists) {
    response.statusCode = 400;
    return response.send({ title: `Id ${id} not found`, cause: `The id cannot null` });
  }

  const task = {
    deletedAt: new Date(),
  };

  await Task.update(task, { where: { id: id } });

  response.statusCode = 200;
  response.send(task);
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

const validateId = (id) => {
  return id != null && id != undefined;
}

const sentInvalidId = (response, message) => {
  response.statusCode = 400;
  return response.send({ title: 'The id cannot be null', cause: message });
}

// create 
app.post('/users', async (request, response) => {
  let { email, firstName, lastName } = request.body;
  if (email == undefined || email == null || email == '') {
    response.statusCode = 400;
    response.send({ error: 'email is null', cause: 'email cannot be null' });
  }
  const userToCreate = {
    email: email,
    firstName,
    lastName
  }

  try {
    const user = await User().create(userToCreate);
    response.statusCode = 200;
    response.send(user);

  } catch (error) {
    console.log('error', error)
    response.statusCode = 500;
    response.send({ error });
  }
});

// to heroku
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log('Started server on port 3000'));
