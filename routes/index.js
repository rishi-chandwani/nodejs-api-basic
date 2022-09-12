const express = require("express");
const router = express.Router();

const userRoutes = require("./users");

module.exports = (params) => {
  router.get('/', (req, res, next) => {
    res.json({ 'status': false, 'message': 'Please pass Module OR Entity' })
  });

  router.use('/users', userRoutes(params));

  return router;
}