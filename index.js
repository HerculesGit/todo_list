const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cors = require('cors')


// express with bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// express with json
app.use(bodyParser.json());

const models = require('./database/models')
//const temp = require('./temp/model');

// list
/**
 * @deprecated
 * 
*/
app.get('/tasks', async (request, response) => {
  response.statusCode = 200;
  try {
    const tasks = await models.task.findAll({ raw: true })
    response.send(tasks);
  } catch (error) {
    console.log('error', error)
    response.statusCode = 500;
    response.send({ error: error });

  }
});

// create 
app.post('/tasks', async (request, response) => {
  await saveTask(request, response);
});

// depois pode ser implementado um lastSynchronizedDate = assim não precisaria jogar um array tão grande do android nem pegar um tao grande no sql
app.post('/user/:id/tasks/synchronize', async (req, response) => {
  let id = req.params.id;

  if (!isNotNull(id)) {
    return sendInvalidIdMessage(response, 'Ops! id is null');
  }

  const notFoundTasks = []; // para serem criadas
  const foundTasks = []; // que estao criadas mas desatualizadas
  const todasAsTasksOk = [];


  // pegar todas as tasks nao deletedAt==null
  let allTasksByUser = await models.task.findAll({
    where: { userId: id },
    paranoid: false,
  });

  const tasksVindasDoAndroid = req.body;

  console.log('tasksVindasDoAndroid =>', req.body)

  // separar as que nao foram encontradas no server online
  tasksVindasDoAndroid.map(taskFromAndroid => {
    const t = allTasksByUser.find(value => value.id == taskFromAndroid.id);
    if (!isNotNull(t)) { // Ainda na duvida se removo ou nao o uuid vinda do android
      notFoundTasks.push(taskFromAndroid);
    } else {
      foundTasks.push(taskFromAndroid);
    }
  });
  console.log('notFoundTasks =>', notFoundTasks)
  console.log('foundTasks =>', foundTasks)

  // atualizar as tasks encontradas
  for (const taskFound of foundTasks) {
    await models.task.update(taskFound, { where: { id: taskFound.id } });
    todasAsTasksOk.push(taskFound);
  }

  // criar todas as tasks nao encontradas
  for (const taskToNormalize of notFoundTasks) {
    const task = await models.task.create(taskToNormalize);
    taskToNormalize['id'] = task.id;
    await models.task.update(taskToNormalize, { where: { id: task.id }, silent: true });
    todasAsTasksOk.push(taskToNormalize);

  }
  console.log('todasAsTasksOk =>', todasAsTasksOk)
  return response.send({ userId: id, lastSynchronizedDate: new Date() });
});

saveTask = async (request, response) => {
  let { name, isDone, userId } = request.body;

  if (!validateId(userId)) {
    response.statusCode = 404;
    console.log('request.body', request.body,)

    return sendInvalidIdMessage(response, 'The userId not informed');
  }
  if (!isNotNull(name) || name === '') {
    response.statusCode = 400;
    return response.send({ title: 'Name is null', cause: 'Name cannot be null' });
  }

  const taskToCreate = {
    name,
    isDone,
    userId
  }
  try {
    const task = await models.task.create(taskToCreate);
    response.statusCode = 200;
    response.send(task);
  } catch (error) {
    response.statusCode = 500;
    console.log('error', error, taskToCreate)
    response.send({ error });
  }
}

// Get all tasks by User
app.get('/user/:id/tasks', async (req, response) => {
  let id = req.params.id;
  if (!validateId(id)) {
    return sendInvalidIdMessage(response, `The id=${id} is null or undefined`);
  }
  try {
    const tasks = await models.task.findAll({
      where: { userId: id }
    });
    if (tasks == null) {
      response.statusCode = 404;
      return response.send({ title: 'User not found', cause: 'The user not found in database' })
    }

    return response.send(tasks);
  } catch (error) {
    console.log('error =>', error)
    response.statusCode = 400;
    return response.send({ title: 'Not found', 'cause': 'User not found' });
  }
});

// get one task
app.get('/task/:id', async (req, response) => {
  let id = req.params.id;

  if (!validateId(id)) {
    return sendInvalidIdMessage(response, `The id=${id} is null or undefined`);
  } else {

    try {
      const task = await models.task.findOne({ where: { id: id } });
      if (task == null) {
        response.statusCode = 404;
        return response.send({ title: 'Task', cause: 'Task not found' })
      }
      return response.send(task);
    } catch (error) {
      console.log('error => ', error)

      response.statusCode = 500;
      return response.send({ title: 'Task not found!', cause: 'Task not found' });
    }
  }
});

// edit
app.put('/task/:id', async (req, response) => {
  let id = req.params.id;

  if (!validateId(id)) {
    return sendInvalidIdMessage(response, `The id=${id} is null or undefined`);
  }
  try {
    let taskToUpdate = await models.task.findOne({ where: { id: id }, raw: true });

    if (!isNotNull(taskToUpdate)) {
      response.statusCode = 404;
      return response.send({ title: 'Task', cause: 'Task not found' });
    }

    Object.keys(taskToUpdate).map(key => taskToUpdate[key] = req.body[key]);
    taskToUpdate['updatedAt'] = new Date();
    await models.task.update(taskToUpdate, { where: { id: id } });
    return response.send(taskToUpdate);

  } catch (error) {
    console.log('error =>', error)
    response.statusCode = 500;
    return response.send({ "cause": "not found task" });
  }

});

// delete
app.delete('/task/:id', async (req, response) => {
  const id = req.params.id;

  if (!validateId(id)) {
    response.statusCode = 404;
    return response.send({ title: `Id null`, cause: `The id cannot be null` });
  }
  try {
    const exists = await findTask(id);
    if (!exists) {
      response.statusCode = 404;
      return response.send({ title: `Id ${id} not found`, cause: `The task not found to delete` });
    }

    const task = {
      deletedAt: new Date(),
    };

    const result = await models.task.update(task, { where: { id: id } });
    console.log('result->', result)
    response.statusCode = 200;
    return response.send({});
  } catch (error) {
    console.log('error->', error)
    return response.send({ title: 'Internal error', cause: '' });

  }

});

const findTask = async (id) => {
  try {
    const task = await models.task.findOne(({ raw: true, where: { id: id } }));
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
  return isNotNull(id);
}

const sendInvalidIdMessage = (response, message) => {
  response.statusCode = 400;
  return response.send({ title: 'The id cannot be null', cause: message });
}

const isNotNull = (value) => {
  return value !== null && value !== undefined;
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
