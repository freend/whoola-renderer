const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/product');
const purchaseRouter = require('./routes/purchase');
const receiverRouter = require('./routes/receiver');
const inviteRouter = require('./routes/invite');
const treeRouter = require('./routes/tree');
const validateRouter = require('./routes/validate');
const pointRouter = require('./routes/point');
const withdrawRouter = require('./routes/withdraw');
const contactRouter = require('./routes/contact');
const noticeRouter = require('./routes/notice');
const orderRouter = require('./routes/order');
const businessRouter = require('./routes/business');
const referenceRouter = require('./routes/reference');
const serviceRouter = require('./routes/service');
const infoRouter = require('./routes/info');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static('public'));

app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));

app.use(express.json());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/purchase', purchaseRouter);
app.use('/receiver', receiverRouter);
app.use('/invite', inviteRouter);
app.use('/tree', treeRouter);
app.use('/validate', validateRouter);
app.use('/point', pointRouter);
app.use('/withdraw', withdrawRouter);
app.use('/contact', contactRouter);
app.use('/notice', noticeRouter);
app.use('/order', orderRouter);
app.use('/business', businessRouter);
app.use('/reference', referenceRouter);
app.use('/service', serviceRouter);
app.use('/info', infoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
let config;
if (process.env.NODE_ENV == undefined) {
  process.env.NODE_ENV = 'local';
}
switch (process.env.NODE_ENV) {
  case 'dev':
    config = require('./config/develop');
    break;
  case 'prod':
    config = require('./config/prod');
    break;
  default:
    config = require('./config/local');
    break;
}

process.env.PORT = config.info.PORT;
process.env.URLS = config.info.URLS;
process.env.API_HOST = config.info.API_HOST;

console.log("node env", process.env.NODE_ENV);
console.log("API_HOST", process.env.API_HOST);
console.log("port", process.env.PORT);
console.log("URLS", process.env.URLS);

module.exports = app;
