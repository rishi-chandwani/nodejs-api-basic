const configs = require('../../configs/index');
const CustomLogs = require('../logs');

const logDate = new Date();
const logDateExtn = logDate.getFullYear() + "" + (logDate.getMonth() + 1) + "" + logDate.getDate();
const errorLogger = new CustomLogs(configs.logPath + 'commonFunctions_' + logDateExtn + '.log');

/**
 * Function to check if the parameter sent is empty of not
 * 
 * @author Rishi Chandwani
 * 
 * @param {any} data - Variable of any type
 * 
 * @return {bool} true : If parameter is defined. false : If parameter is undefined
*/
const isUndefined = (data) => {
  let status = false;

  if(typeof data === 'undefined' || [undefined, null, 'null', 'undefined', ''].includes(data)) {
    status = true;
  }

  return status;
}

/**
 * Function to check if the details of parameters are same or not
 * It will be used to check if Database values are updated as sent in the Update request
 * 
 * @author Rishi Chandwani
 * 
 * @param {Array} newDetails - Data as sent in request by User
 * @param {Array} updatedDetails - Updated result in Database
 * 
 * @return {bool} true: If details are updated in Database. false: If details are not updated
*/
const isUpdated = (newDetails, updatedDetails) => {
  let status = true;

  try {
    for(const userKey in newDetails) {
      if(newDetails[userKey] !== updatedDetails[userKey]) {
        status = false;
        break;
      }
    }
  } catch (err) {
    errorLogger.addCustomLogs('error', err.toString());
    status = false;
  }

  return status;
}

/**
 * Function to encrypt any sensitive data provided in parameter
 * 
 * @author Rishi Chandwani
 * 
 * @param {Object} data - Object containing details that should be encrypted
 * 
 * @return {Object} Object with the encrypted details
 */
 const encryptSensitiveData = (data) => {
  try {
    if(!isUndefined(data.email)) {
      //Encrypt Email before storing to database
    }

    if(!isUndefined(data.mobile)) {
      // Encrypt Mobile before storing to database
    }
  } catch (err) {
    errorLogger.addCustomLogs('error', err.toString());
  }

  return data;
}

/**
 * Function to validate username
 * 
 * @author Rishi Chandwani
 * 
 * @param {String} username - The username that was entered by User while registering
 * 
 * @return {bool} true: If username is valid. false: If username is invalid.
 */
const validateUsername = (username) => {
  let status = true;
  let matchPattern = /^[a-z]{1,}[a-z0-9@#$\-_\.]*[a-z]{1,}$/i;

  if(isUndefined(username)) {
    status = false;
  } else if(username.length < 8 || username.length > 20) {
    status = false
  } else if(!username.match(matchPattern)) {
    status = false;
  }

  return status;
}

/**
 * Function to validate if email address is valid or not
 * 
 * @author Rishi Chandwani
 * 
 * @param {String} email - Email Address to be validated
 * 
 * @return {bool} true : If email is valid. false : If email is invalid
 */
const validateEmail = (email) => {
  let validationStatus = true;
  let matchPattern = /^[a-z]{1,}[a-z0-9\-_\.]*[@][a-z]{1,}\.[a-z]{2,}$/;

  if(!email.match(matchPattern)) {
    validationStatus = false;
  }

  return validationStatus;
}

/**
 * Function to validate Mobile Number
 * 
 * @author Rishi Chandwani
 * 
 * @param {String} mobile - Mobile number to be validated
 * 
 * @returns {bool} true : If mobile is valid. false : If mobile is invalid
 */
const validateMobile = (mobile) => {
  let matchPattern = /^[6789]{1}[0-9]{9}$/;
  return mobile.match(matchPattern);
}

/**
 * Function to validate all the user details
 * 
 * @author Rishi Chandwani
 * 
 * @param {Object} data - The details that was entered by user while registering
 * 
 * @return {Object} Object containing the Status and Message based on the validations
 */
const validateUserDetails = (data) => {
  let validationStatus = false;
  let validationMessage = '';

  try {
    if(isUndefined(data)) {
      validationMessage = 'No data sent in request';
    }

    if(validationMessage === '' && !isUndefined(data.username) && !validateUsername(data.username)) {
      validationMessage = 'Please enter valid username. It should be 8 to 20 characters long, Alphanumeric, and special characters from !.@-_#$';
    }

    if(validationMessage === '' && !isUndefined(data.email) && !validateEmail(data.email)) {
      validationMessage = 'Email is not valid';
    }

    if(validationMessage === '' && !isUndefined(data.mobile) && !validateMobile(data.mobile)) {
      validationMessage = 'Mobile is not valid';
    }
  } catch (err) {
    errorLogger.addCustomLogs('error', err.toString());
    validationMessage = 'Error occured while validating user details';
  }

  if (validationMessage === '') {
    validationStatus = true;
  }

  return {
    validationStatus,
    validationMessage
  };
}

module.exports = {
  isUndefined,
  isUpdated,
  encryptSensitiveData,
  validateUserDetails
}
