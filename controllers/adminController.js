const getDashboardPage = async (req, res) => {
    try {
        res.render('dashboard', { title: 'ADMIN', layout: 'layouts/admin'});
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getDashboardPage
};