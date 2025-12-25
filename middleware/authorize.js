const secretModule = require('../secretModule');

const user = async (req, res, next) => {
    try {
        if(req.cookies['adr_data']) {
            try {
                const adrData = JSON.parse(secretModule.decrypt(req.cookies['adr_data'], process.env.TOKEN_PASSWORD));
                req.userId = adrData.id;
            } catch (err) {
                console.log(err);
                res.redirect('/login')
            }
            next();
        } else {
            res.redirect('/login?requestedUrl=' + encodeURIComponent(req.originalUrl))
        }
    } catch (error) {
        console.log(error);
        res.redirect('/login')
    }
};
    
module.exports = { user };