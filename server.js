const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const homeRouter = require('./routers/html/homeRouter');
const apiRouter = require('./routers/api/addInstructionRouter');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);

// Routes
app.use('/', homeRouter);
app.use('/api/', apiRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {title: 'ADR app', url: req.originalUrl, layout: 'layouts/main' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {
        title: 'ADR app', 
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {},
        layout: 'layouts/main'
    });
});



mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log('Database connected.');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.log(error.message);
});