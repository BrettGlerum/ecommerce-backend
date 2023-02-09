// grabs the routes from the other files
const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');
// uses the routes
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);

// exports router
module.exports = router;