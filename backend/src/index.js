const express = require('express');
var morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = 3001;
const db = require('./config/db');

// bật cors cho react
app.use(cors());

// dùng morgan
app.use(morgan('dev'));

const path = require('path');
app.use('/avatars', express.static(path.join(__dirname, '../uploads/avatars')));
app.use('/uploads/variants', express.static(path.join(__dirname, '../uploads/variants')));



// Middleware parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect db
db.connect();

// routes
const route = require('./routes');
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
