const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const PORT = process.env.PORT || 4444;
const db = require('./config/db_connection');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config();
//grabbing my controllers
const { view_routes, auth_routes } = require('./controllers');
const app = express();

app.use(express.static(path.join('front')));
//handlebars engine
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
//default middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//enviroment stuff so it works on heroku
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({ db }),
  saveUninitialized: false,
  resave: false,
  cookie: {
  }
}));
//these are in the controller files instead of being written out here
app.use('/', view_routes);
app.use('/auth', auth_routes);
// runs server and resyncs db
db.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});