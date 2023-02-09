// set up the api router
const router = require('express').Router();
const { Category, Product } = require('../../models');



router.get('/', async(req, res) => {
  // find all categories and include their associated Products
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
        },
      ],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async(req, res) => {
  // finds category by id and includes associated products
  try {
    const categoryByID = await Category.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Product,
        },
      ],
    });
    if (categoryByID) {
      res.json(categoryByID);
    } else {
      res.status(404).json({ error: "No category by with this ID" });
    }
  } catch (error) {
    res.status(501).json(error);
  }
});

router.post('/', async(req, res) => {
  // creates a new category
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });
    res.json(newCategory);
  } catch (error) {
    res.status(502).json(error);
  }
});

router.put('/:id', async(req, res) => {
  // updates a category by its `id` value
  try {
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (updatedCategory) {
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: "No category by with this ID" });
    }
  } catch (error) {
    res.status(503).json(error);
  }
});

router.delete('/:id', async(req, res) => {
  // deletes a category by its `id` value
  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedCategory) {
      res.json(deletedCategory);
    } else {
      res.status(404).json({ error: "No category with this ID" });
    }
  } catch (error) {
    res.status(503).json(error);
  }
  
});

// exports router
module.exports = router;