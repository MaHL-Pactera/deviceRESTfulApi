# todoListApi
express RESTFul api for basic introduction

# 简单教程

## 环境准备
我们默认你已经装好了Node.js和npm，可以通过`node -v`和`npm -v`命令来检查是否装好，显示出正确的版本信息就代表环境准备ok。

现在我们开始进行如下操作：

### 项目结构搭建

1. 创建名为todoListApi的文件目录 `mkdir todoListApi`
2. 进入该目录 `cd todoListApi`
3. 使用`git init`命令初始化git项目
4. 使用`npm init`命令生成package.json文件，输入命令后你需要手动按照提示输入app name， description，version，author等信息。
最终你会得到类似下例的文件：
```
{
  "name": "todolistapi",
  "version": "1.0.0",
  "description": "CRUD api for todo list",
  "main": "index.js",
  "dependencies": {
    "body-parser": "~1.18.3",
    "express": "~4.16.3"
  },
  "devDependencies": {
    "nodemon": "~1.17.4"
  },
  "scripts": {
    "test": "echo \"Error, no test specified\" && exit 1",
    "start": "node server.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Agile-Web-Training-Xijiao/todoListApi.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/Agile-Web-Training-Xijiao/todoListApi/issues"
  },
  "homepage": "https://github.com/Agile-Web-Training-Xijiao/todoListApi#readme"
}
```
5. 创建`server.js`文件
6. 创建名为app的目录`mkdir app`
7. 在app目录下创建`models`，`routes`，`controllers`和`repositories`目录
8. 在controllers、models、routes、repositories目录下分别创建todoListController.js、todo.js、todoListRoutes.js和todoListRepository.js文件，你会得到如下的目录结构
```
├── README.md
├── app
│   ├── controllers
│   │   └── todoListController.js
│   ├── models
│   │   └── todo.js
│   ├── repositories
│   │   └── todoListRepository.js
│   └── routes
│       └── todoListRoutes.js
├── package.json
└── server.js
```
## Server setup
接下来我们开始安装我们的项目和开发依赖，我们使用express来创建一个http sever，使用nodmon来帮助我们在开发环境下自动监听代码变化并重新启动server。

在package.json中添加关于express和nodemon的依赖，并在scripts中添加nodemon的启动命令:
```
  "dependencies": {
    "body-parser": "~1.18.3",
    "express": "~4.16.3"
  },
  "devDependencies": {
    "nodemon": "~1.17.4"
  },
  "scripts": {
    "test": "echo \"Error, no test specified\" && exit 1",
    "start": "nodemon server.js"
  },
```
随后运行`npm install`来进行依赖安装。

下来我们修改server.js文件，将以下代码放入该文件:
```
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
```
这时候我们如果运行`npm run start`的话，你会看到

`todo list RESTful API server started on: 3000`

的提示，表明我们已经在3000端口启动了一个express server。

## 创建todo模型
这一步我们会定义我们需要的todo模型，定义其应该拥有的属性。
编辑todo.js，写入如下代码：
```
class Todo {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isFinished = false;
    this.createdAt = new Date();
  }
}

module.exports = Todo;
```
可以看到我们为todo定义了id、name、description、isFinished和createAt这几个属性，其中isFinished默认为false，createdAt会使用一个当前时间戳。现在todo还没有更复杂的业务逻辑，所以暂时只需要一个构造函数。

## 创建repository

在这个例子里为了简单起见，我们不涉及与数据库的集成部分，所以使用内存来模拟数据操作，所以这里会手写一个基于内存的repository。
编辑todoListRepository.js，写入如下代码：
```
const Todo = require("../models/todo");

let currentId = 0;

class TodoListRepository {
  constructor() {
    const todo1 = new Todo(++currentId, "todo1", "todo1 desc");
    const todo2 = new Todo(++currentId, "todo2", "todo2 desc");
    todo1.isFinished = true;
    this.todoList = [todo1, todo2];
  }

  listAllTodos() {
    //实现查看所有todos的方法
  }

  findTodoBy(id) {
    //实现通过id查看具体todo的方法
  }

  createTodo(todoBody) {
    //实现创建新todo纪录的方法
  }

  updateTodo(id, update) {
    //实现通过id和一个更新对象来更新todo纪录的方法
  }

  deleteTodoBy(id) {
    //实现通过id来删除todo纪录的方法
  }
}

module.exports = new TodoListRepository();
```
可以看到我们用一个全局currentId来模拟了数据id的自增，使用一个内存数组来存放所有的todo信息，我们希望通过对该数组的操作来实现对于所有todo的增删改查。请尝试自己来实现这些功能。（所有对于todo记录的修改都是基于todoList这个内存数组来实现）

## 创建controller
有了model和repository，我们就有了基本的业务操作能力，这时候让我们来完成controller的逻辑。controller负责完成对于不同请求的处理，返回正确的response，这里让我们利用写好的repository来完成增删改查这些基本动作。

```
const todoListRepository = require("../repositories/todoListRepository");

exports.listAllTodos = function(req, res) {
  const todoList = todoListRepository.listAllTodos();
  res.json(todoList);
};

exports.createTodo = function(req, res) {
  todoListRepository.createTodo(req.body);
  res.status(201).end();
};

exports.readTodo = function(req, res) {
  const todo = todoListRepository.findTodoBy(req.params.todoId);
  res.json(todo);
};

exports.updateTodo = function(req, res) {
  const todo = todoListRepository.updateTodo(req.params.todoId, req.body);
  res.json(todo);
};

exports.deleteTodo = function(req, res) {
  todoListRepository.deleteTodoBy(req.params.todoId);
  res.json({ message: 'Todo successfully deleted' });
};
```
可以看到express的controller其实就是一系列针对req和res操作的函数。
其中res.json可以将我们所要提供的信息以json格式写入response里，同时我们可以从req中拿到request里的参数和body。

## 创建route

express的路由文件决定了我们的server对于不同的HTTP请求的分发，在如下的例子里我们可以看出，我们定义了两中主要的route：`/todos` 和`/todos/:todoId`。同时又针对这两种route定义了在对应不同的HTTP动作时（GET, POSt, PUT, DELETE）会调用那些不同的controller方法。
```
module.exports = function(app) {
  const todoList = require('../controllers/todoListController');

  // todoList Routes
  app.route('/todos')
    .get(todoList.listAllTodos)
    .post(todoList.createTodo);

  app.route('/todos/:todoId')
    .get(todoList.readTodo)
    .put(todoList.updateTodo)
    .delete(todoList.deleteTodo);
};
```
## 整合所有的部件

现在，我们已经完成了model、controller、repository、routes这些代码的编写，接下来我们要开始为最初简单的server.js添加代码，整合之前完成的各个文件，让我们的todoListAPi能够运行起来。

我们需要做的事情有：

1. 使用bodyParse作为一个中间件来parse请求的body，并做url的decoding
2. 将创建好的routes注册到server中
```
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/todoListRoutes'); //importing route
routes(app); //register the route
app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
```

## 测试我们的api

我们可以使用浏览器和postman来测试我们的api功能
如果需要安装postman，可以参考[此文章](https://www.cnblogs.com/mafly/p/postman.html)
在启动了我们的server之后`npm run start`，我们就可以通过 http://localhost:3000/todos 来访问我们的api了

## 更好地处理非法的url
我们会注意到，当我们试图访问localhost上我们并没有定义的路径时（比如 http://localhost:3000/abc）我们会得到404的状态码以及一个默认信息“Cannot GET /abc”，我们可以通过增加一个express middleware来更好地处理这种情况。middleware会拦截进入的请求并做相应处理，所以我们可以在里面做诸如登陆验证之类的操作，这里我们简单增加一个处理未定义route的方法：
```
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});
```
需要注意，这句代码需要添加在routes注册之后，确保其只拦截合法routes外的请求。

# 总结
到这里，我们就完成了一个非常简单的基于express的RESTful api。当然，还有很多的功能需要完善，比如对于查询不到记录时的处理等等。通过这个联系，我们会对如何完成一个api有一些基本的认知和了解，希望大家之后可以自己做更多的练习。
