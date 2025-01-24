const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  const errors = [];

  if (!firstName) {
    errors.push("First name is required.");
  }

  if (!lastName) {
    errors.push("Last name is required.");
  }

  if (!validator.isEmail(emailId)) {
    errors.push("Email is not valid.");
  }

  if (!validator.isStrongPassword(password)) {
    errors.push(
      "Password must have at least 8 characters, including an uppercase letter, a number, and a special character."
    );
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "emailId",
    "gender",
    "age",
    "about",
    "skills",
  ];

  // Check if all fields in req.body are allowed
  const isEditAllowed = Object.keys(req.body).every((field) => 
    allowedEditFields.includes(field) // Return true if the field is in allowedEditFields
  );

  return isEditAllowed;
};

module.exports ={validateSignupData,validateEditProfileData};
