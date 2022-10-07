const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const {validateUser} = require('../middleware/validation/userValidator');
const {validateUserEdit} = require("../middleware/validation/userValidatorEdit");

router.route('/')
    .get(userController.getAllUsers)
    .post(validateUser, userController.createNewUser)
    .patch(validateUserEdit, userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;