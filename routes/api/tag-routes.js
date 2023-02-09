//imports the router 
const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags and include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
        },
      ],
    });
    res.json(tags);
  } catch (error) {
    res.status(507).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // finds a single tag by its `id` value
  try {
    const tagByID = await Tag.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Product,
        },
      ],
    });
    if (tagByID) {
      res.json(tagByID);
    } else {
      res.status(404).json({ error: "No tag with this ID" });
    }
  } catch (error) {
    res.status(508).json(error);
  }
});

router.post('/', async (req, res) => {
  // creates a new tag
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.json(newTag);
  } catch (error) {
    res.status(507).json(error);
  }
});

router.put('/:id', async (req, res) => {
  // updates a tag's name by its `id` value
  try {
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (updatedTag) {
      res.json(updatedTag);
    } else {
      res.status(404).json({ error: "No tag with this ID" });
    }
  } catch (error) {
    res.status(509).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // deletes on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (updatedTag) {
      res.json(deletedTag);
    } else {
      res.status(404).json({ error: "No tag with this ID" });
    }
  } catch (error) {
    res.status(510).json(error);
  }
});
// export the router
module.exports = router;