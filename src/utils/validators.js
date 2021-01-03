const validateRegisterInput = (
  email = "",
  password = "",
  confirmPassword = ""
) => {
  const errors = {};

  // vérification de l'email
  if (email.trim() === "") {
    errors.email = "Vous devez entrer une adresse email.";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]?[0-9a-zA-Z])*)@([0-9a-zA-Z]([-.\w]?[0-9a-zA-Z])*)\.([a-zA-Z]{2,9})$/;

    if (!email.trim().match(regEx)) {
      errors.email = "L'adresse email n'est pas valide";
    }
  }

  // vérification du password
  if (password.trim() === "") {
    errors.password = "Vous devez entrer un mot de passe";
  } else if (password != confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return {
    errors,
    // valid si errors est un objet vide
    valid: Object.keys(errors).length === 0,
  };
};

const validateLoginInput = (email = "", password = "") => {
  const errors = {};

  // vérification de l'email
  if (email.trim() === "") {
    errors.email = "Vous devez entrer une adresse email.";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]?[0-9a-zA-Z])*)@([0-9a-zA-Z]([-.\w]?[0-9a-zA-Z])*)\.([a-zA-Z]{2,9})$/;

    if (!email.trim().match(regEx)) {
      errors.email = "L'adresse email n'est pas valide";
    }
  }

  // vérification du password
  if (password.trim() === "") {
    errors.password = "Vous devez entrer un mot de passe";
  }

  return {
    errors,
    // valid si errors est un objet vide
    valid: Object.keys(errors).length === 0,
  };
};

const validateChangePasswordInput = (
  oldPassword = "",
  newPassword = "",
  confirmNewPassword = ""
) => {
  const errors = {};

  // vérification de l'ancien password
  if (oldPassword.trim() === "") {
    errors.oldPassword = "Vous devez entrer l'ancien mot de passe";
  }

  // vérification du nouveau password
  if (newPassword.trim() === "") {
    errors.newPassword = "Vous devez entrer l'ancien mot de passe";
  } else if (newPassword !== confirmNewPassword) {
    errors.confirmNewPassword = "Les mots de passe ne correspondent pas.";
  }

  return {
    errors,
    // valid si errors est un objet vide
    valid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateChangePasswordInput,
};
