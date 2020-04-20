const repository = require("../repositories/deviceCodeRepository");

exports.getDeviceCode = async function(req, res) {
  console.log(req.body);
  await repository.getDeviceCode(req, res);
};

exports.postDeviceCode = async function(req, res) {  
  console.log(req.body);
  await repository.postDeviceCode(req, res);
};

exports.getToken = async function(req, res) {
  //var body = JSON.parse(req.body); 
  console.log(req.body);
  await repository.getToken(req, res);
};

exports.getTokenWithRefreshToken = async function(req, res) {
  //var body = JSON.parse(req.body); 
  console.log(req.body);
  await repository.getTokenWithRefreshToken(req, res);
};

// exports.updateTodo = function(req, res) {
//   const todo = todoListRepository.updateTodo(req.params.todoId, req.body);
//   res.json(todo);
// };

// exports.deleteTodo = function(req, res) {
//   todoListRepository.deleteTodoBy(req.params.todoId);
//   res.json({ message: 'Todo successfully deleted' });
// };