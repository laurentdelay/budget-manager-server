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

    if (!email.match(regEx)) {
      errors.email = "L'adresse email n'est pas valide";
    }
  }

  // vérification du password
  if (password.trim() === "") {
    errors.password = "Vous devez entre un mot de passe";
  } else if (password != confirmPassword) {
    errors.password = "Les mots de passe ne correspondent pas";
  }

  return {
    errors,
    // valid si errors est un objet vide
    valid: Object.keys(errors).length === 0,
  };
};

module.exports = { validateRegisterInput };
