const express = require('express');
const path = require('path');
const parser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views')

const { adminRouter } = require('./routes/admin');
const { router } = require('./routes/shop');
const { errorRouter } = require('./routes/error-page')

app.use(parser.urlencoded( { extended: false } ));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRouter);
app.use(router);
app.use(errorRouter);


app.listen(process.env.PORT || 3000);