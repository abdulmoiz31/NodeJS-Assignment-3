const cluster = require('cluster');
const os = require('os');
const express = require('express');
require('dotenv').config();
const app = express();
const signupRouter = require('./signup/signup.routes')
const signinRouter = require('./signin/signin.routes')
const productRouter = require('./product/product.routes')
const categoryRouter = require('./category/category.routes')
const cartRouter = require('./cart/cart.routes')
//const db = require('./db')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 8080;

if (cluster.isMaster) {
  // Get the number of CPU cores
  const numCPUs = os.cpus().length;
    console.log('CPUS: ', numCPUs);
  console.log(`Master ${process.pid} is running`);

  // Fork workers equal to the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exits and fork a new worker
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  app.use('/signup', signupRouter);
  app.use('/signin', signinRouter);
  app.use('/product', productRouter);
  app.use('/category', categoryRouter);
  app.use('/cart', cartRouter);

  app.listen(process.env.PORT || port, () => {
    console.log(`Worker ${process.pid} is running on port ${port}`);
  });
}
