// set up routes
const router = require('express').Router();
const apiRoutes = require('./api');

// creates api route
router.use('/api', apiRoutes);
// error route
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

// exports router
module.exports = router;