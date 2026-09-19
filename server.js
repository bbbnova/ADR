const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
require('./config/loadSecrets')();
const cookieParser = require('cookie-parser');

const homeRouter = require('./routers/homeRouter');
const adminRouter = require('./routers/adminRouter'); 

//cookie parser
app.use(cookieParser());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '5000kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);

// Routes
app.use('/', homeRouter);
app.use('/admin/', adminRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Действие при инциденти с опасни товари', 
        url: req.originalUrl, 
        layout: 'layouts/main' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {
        title: 'Действие при инциденти с опасни товари', 
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {},
        layout: 'layouts/main'
    });
});

function getDatabaseUrl() {
    const url = String(process.env.DATABASE_URL || '').trim();
    if (!url) throw new Error('DATABASE_URL is required');

    if (process.env.NODE_ENV === 'production') {
        const hasCredentials = /^mongodb(?:\+srv)?:\/\/[^/@]+:[^/@]+@/.test(url);
        const usesTls = url.startsWith('mongodb+srv://') || /[?&](?:tls|ssl)=true(?:&|$)/i.test(url);
        if (!hasCredentials) throw new Error('Production MongoDB requires a dedicated username and password');
        if (!usesTls) throw new Error('Production MongoDB requires TLS');
    }
    return url;
}

mongoose.connect(getDatabaseUrl()).then(() => {
    console.log('Database connected.');
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
});
