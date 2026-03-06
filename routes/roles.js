var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/roles');

// GET all roles (excluding soft deleted)
router.get('/', async function (req, res, next) {
  let data = await roleSchema.find({});
  let result = data.filter(e => !e.isDeleted);
  res.send(result);
});

// GET role by id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findOne({ _id: req.params.id });
    if (result && !result.isDeleted) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

// CREATE new role
router.post('/', async function (req, res, next) {
  try {
    let newObj = new roleSchema({
      name: req.body.name,
      description: req.body.description
    });
    await newObj.save();
    res.send(newObj);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// UPDATE existing role
router.put('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(result);
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

// SOFT DELETE role
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.status(200).send(result);
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

module.exports = router;
