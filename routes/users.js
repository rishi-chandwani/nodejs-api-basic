const express = require("express");
const router = express.Router();

const configs = require("../configs/index");

const userModel = require("../models/Users");
const commonFunctions = require("../services/common/index");
const CustomLogs = require('../services/logs');

const logDate = new Date();
const logDateExtn = logDate.getFullYear() + "" + (logDate.getMonth() + 1) + "" + logDate.getDate();
const errorLogger = new CustomLogs(configs.logPath + 'usersOperations_' + logDateExtn + '.log');

module.exports = (params) => {
  /**
   * Route to fetch details of all the users
   */
  router.get('/fetchAll', async (req, res) => {
    let userDetails = [];
    let status = true,
      message = '';

    try {
      userDetails = await userModel.find({}).select('-__v');
      if(commonFunctions.isUndefined(userDetails)) {
        message = 'No records found';
      }
    } catch (err) {
      errorLogger.addCustomLogs('error', err.toString());
      status = false;
      message = 'Error while fetching user details';
    }

    if(commonFunctions.isUndefined(message)) {
      message = 'Details fetched successfully';
    }

    res.json({status, message, userDetails});
  });

  /**
   * Route to fetch details of specific User ID
   */
  router.get('/getUserById/:userId', async (req, res) => {
    let status = true,
        message = '',
        userDetails = {};

    try {
      let userId = req.params.userId;
      errorLogger.addCustomLogs('info', 'User-ID : ' + userId);

      if(!commonFunctions.isUndefined(userId)) {
        userDetails = await userModel.findById(userId).select('-__v');
        if(commonFunctions.isUndefined(userDetails)) {
          message = 'No record found';
        }
      }
    } catch (err) {
      errorLogger.addCustomLogs('error', err.toString());
      status = false;
      message = 'Error while fetching details';
    }

    if(commonFunctions.isUndefined(message)) {
      message = 'Details fetched successfully';
    }

    res.json({ status, message, userDetails});
  });
 
 /**
   * Route to add new user
   */
  router.post('/addUser', async (req, res, next) => {
    let userDetails = req.body;
    let addStatus = false;
    let addMessage = '';

    try {
      let { validationStatus, validationMessage } = commonFunctions.validateUserDetails(userDetails);

      if(commonFunctions.isUndefined(validationStatus) || validationStatus === false) {
        addMessage = validationMessage;
        errorLogger.addCustomLogs('error', 'User Validation Message - ' + validationMessage);
        return res.json({'status': addStatus, 'message': addMessage});
      }

      userDetails = commonFunctions.encryptSensitiveData(userDetails);

      let duplicateCondition = [
        {username: userDetails.username}
      ];
      let validationError = 'Username: ' + userDetails.username;

      if(!commonFunctions.isUndefined(userDetails.mobile)) {
        duplicateCondition.push({mobile: userDetails.mobile});
        validationError += ' Mobile : ' + userDetails.mobile;
      }

      if(!commonFunctions.isUndefined(userDetails.email)) {
        duplicateCondition.push({email: userDetails.email});
        validationError += ' Email : ' + userDetails.email;
      }

      existingUser = await userModel.findOne({$or: duplicateCondition});
      if(!commonFunctions.isUndefined(existingUser)) {
        addMessage = 'User with either of following details already exists: ' + validationError;
        errorLogger.addCustomLogs('error', 'User Validation Message - ' + addMessage);
        return res.json({'status': addStatus, 'message': addMessage});
      }

      let newUser = new userModel(userDetails);
      let saveStatus = await newUser.save();

      addMessage = 'Unable to save user';

      if(!commonFunctions.isUndefined(saveStatus)) {
        addStatus = true;
        addMessage = 'User saved successfully';
      }
    } catch(err) {
      errorLogger.addCustomLogs('error', err.toString());
      addMessage = 'Exception while adding new user';
    }

    res.json({'status': addStatus, 'message': addMessage});
  });

  /**
   * Router to update existing user
   */
  router.patch('/updateUser/:userId', async (req, res) => {
    let updateStatus = false;
    let updateMessage = '';

    try {
      let userId = req.params.userId;
      let userData = req.body;

      let { validationStatus, validationMessage } = commonFunctions.validateUserDetails(userData);

      if(commonFunctions.isUndefined(validationStatus) || validationStatus === false) {
        updateMessage = validationMessage;
        errorLogger.addCustomLogs('error', 'User Validation Message - ' + validationMessage);
        return res.json({'status': updateStatus, 'message': updateMessage});
      }

      let userDetails = await userModel.findById(userId);

      if(!commonFunctions.isUndefined(userDetails)) {
        await userModel.findByIdAndUpdate(userId, userData, {new: true})
        .then(updatedData => {
          if(!commonFunctions.isUndefined(updatedData) && commonFunctions.isUpdated(userData, updatedData)) {
            updateStatus = true;
            updateMessage = 'User updated successfully';
          }
        })
        .catch(err => {
          errorLogger.addCustomLogs('error', err.toString());
          updateMessage = 'Exception while updating user';
        });
      } else {
        updateMessage = 'No user found';
      }
    } catch(err) {
      errorLogger.addCustomLogs('error', err.toString());
      updateMessage = 'Exception while updating user';
    }

    res.json({'status': updateStatus, 'message': updateMessage});
  });

  return router;
}