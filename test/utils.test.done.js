const { expect } = require("chai");
const { validateRegisterInput } = require("../src/utils/validators");

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

      expect(result).to.have.property("errors").with.property("password");
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
});
