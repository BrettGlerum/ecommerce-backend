// grabs the routes from the other files
const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');



// get all products
router.get('/', async(req, res) => {
  // finds all products and includes their associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
        },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(504).json(error);
  }
});

// gets one product
router.get('/:id', async(req, res) => {
  // finds one product by its `id` value and includes its associated Category and Tag data
  try {
    const productByID = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
        },
      ],
    });
    if (productByID) {
      res.json(productByID);
    } else {
      res.status(404).json({ error: "No product with this ID" });
    }
  } catch (error) {
    res.status(505).json(error);
  }
});

// creates new product
router.post('/', (req, res) => {

  
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // finds all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // gets list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async(req, res) => {
  // deletes one product by its `id` value
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: "No product with this ID" });
    }
  } catch (error) {
    res.status(506).json(error);
  }
});
// exports the routes
module.exports = router;