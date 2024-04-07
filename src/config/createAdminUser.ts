const { KEYS } = require("../constants/index.ts");
const bcrypt = require("bcrypt");
const { CreateUserService } = require("../service/users/CreateUserService");
const {
  EmailCreationNotifier,
} = require("../service/users/observers/EmailNotifier");

const createUserService = new CreateUserService(new EmailCreationNotifier());

async function createAdminUser() {}
