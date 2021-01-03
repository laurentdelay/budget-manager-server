const { expect } = require("chai");
const {
  validateRegisterInput,
  validateLoginInput,
  validateChangePasswordInput,
} = require("../src/utils/validators");

describe("validators", () => {
  describe("validateRegisterInput", () => {
    it("should return an object", () => {
      const result = validateRegisterInput();

      expect(result).to.be.a("object");
    });

    it("should return errors for missing email or password", () => {
      const result = validateRegisterInput();

      expect(result, "Missing email")
        .to.have.property("errors")
        .with.property("email");
      expect(result, "Missing password")
        .to.have.property("errors")
        .with.property("password");
    });

    it("should return an error for wrong email input", () => {
      const result = validateRegisterInput(
        "wrongEmail",
        "password",
        "password"
      );

      expect(result, "Wrong email")
        .to.have.property("errors")
        .with.property("email");
    });

    it("should return an error for passwords not matching", () => {
      const result = validateRegisterInput(
        "test@mail.com",
        "password1",
        "password2"
      );

      expect(result)
        .to.have.property("errors")
        .with.property("confirmPassword");
    });

    it("should not be valid if any error exists", () => {
      const result = validateRegisterInput();

      expect(result).to.have.property("valid").and.to.be.false;
    });

    it("should be valid if no error exists", () => {
      const result = validateRegisterInput(
        "test@mail.com",
        "password",
        "password"
      );

      expect(result).to.have.property("valid").and.to.be.true;
    });
  });

  describe("validateLoginInput", () => {
    it("should return an object", () => {
      const result = validateLoginInput();

      expect(result).to.be.a("object");
    });

    it("should return errors for missing email or password", () => {
      const result = validateLoginInput();

      expect(result, "Missing email")
        .to.have.property("errors")
        .with.property("email");
      expect(result, "Missing password")
        .to.have.property("errors")
        .with.property("password");
    });

    it("should return an error for wrong email input", () => {
      const result = validateLoginInput("wrongEmail", "password");

      expect(result, "Wrong email")
        .to.have.property("errors")
        .with.property("email");
    });

    it("should not be valid if any error exists", () => {
      const result = validateLoginInput();

      expect(result).to.have.property("valid").and.to.be.false;
    });

    it("should be valid if no error exists", () => {
      const result = validateLoginInput("test@mail.com", "password");

      expect(result).to.have.property("valid").and.to.be.true;
    });
  });

  describe("validateChangePasswordInput", () => {
    it("should return an object", () => {
      const result = validateChangePasswordInput();

      expect(result).to.be.a("object");
    });

    it("should return errors for missing old or new password", () => {
      const result = validateChangePasswordInput();

      expect(result, "Missing oldPassword")
        .to.have.property("errors")
        .with.property("oldPassword");
      expect(result, "Missing newPassword")
        .to.have.property("errors")
        .with.property("newPassword");
    });

    it("should return an error for different new password inputs", () => {
      const oldPassword = "oldPass";
      const newPassword = "newPass";
      const confirmNewPassword = "differentPass";

      const result = validateChangePasswordInput(
        oldPassword,
        newPassword,
        confirmNewPassword
      );

      expect(result, "Different passwords")
        .to.have.property("errors")
        .with.property("confirmNewPassword");
    });

    it("should not be valid if any error exists", () => {
      const result = validateChangePasswordInput();

      expect(result).to.have.property("valid").and.to.be.false;
    });

    it("should be valid if no error exists", () => {
      const oldPassword = "oldPass";
      const newPassword = "newPass";
      const confirmNewPassword = "newPass";

      const result = validateChangePasswordInput(
        oldPassword,
        newPassword,
        confirmNewPassword
      );

      expect(result).to.have.property("valid").and.to.be.true;
    });
  });
});
