const authorize = async (req, res, next) => {
    try {
        if(req.cookies['adr_data']) {
            const adrData = JSON.parse(req.cookies['adr_data']);
            
        }
    } catch (error) {
        next(error);
    }
};

module.exports = authorize;