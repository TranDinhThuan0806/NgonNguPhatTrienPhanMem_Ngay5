var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users');

// GET all users (excluding soft deleted)
router.get('/', async function(req, res, next) {
  let data = await userSchema.find({});
  let result = data.filter(u => !u.isDeleted);
  res.send(result);
});

// GET user by id
router.get('/:id', async function(req, res, next) {
  try {
    let result = await userSchema.findOne({ _id: req.params.id });
    if (result && !result.isDeleted) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

// CREATE new user
router.post('/', async function(req, res, next) {
  try {
    let newObj = new userSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.roleId,
      loginCount: req.body.loginCount
    });
    await newObj.save();
    res.send(newObj);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// UPDATE user
router.put('/:id', async function(req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(result);
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

// SOFT DELETE user
router.delete('/:id', async function(req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.status(200).send(result);
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

// ENABLE user status by email+username
router.post('/enable', async function(req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userSchema.findOne({ email: email, username: username });
    if (!user) {
      return res.status(404).send({ message: "USER NOT FOUND" });
    }
    user.status = true;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// DISABLE user status by email+username
router.post('/disable', async function(req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userSchema.findOne({ email: email, username: username });
    if (!user) {
      return res.status(404).send({ message: "USER NOT FOUND" });
    }
    user.status = false;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
