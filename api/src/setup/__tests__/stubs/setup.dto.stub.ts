import type { SetupDto } from "@/setup/zod/setup";

export const manualSetupDtoFactory = (): SetupDto => ({
  admin: {
    email: 'xyz@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123',
    role: "ADMIN"
  },

  setupConfig: {
    userVerification: {
      method: 'MANUAL'
    }
  }
});

export const EmailSetupDtoFactory = (): SetupDto => ({
  admin: {
    email: 'xyz@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123',
    role: "ADMIN"
  },

  setupConfig: {
    userVerification: {
      method: 'CONFIRM_EMAIL'
    }
  }
});

export const RegexSetupDtoFactory = (): SetupDto => ({
  admin: {
    email: 'xyz@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123',
    role: "ADMIN"
  },

  setupConfig: {
    userVerification: {
      method: 'REGEX_EMAIL',
      regex: "some_regex"
    }
  }
});
