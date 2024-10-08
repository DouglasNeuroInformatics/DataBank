import type { SetupDto } from '@/setup/zod/setup';

export const manualSetupDtoFactory = (): SetupDto => ({
  admin: {
    email: 'xyz@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123',
    role: 'ADMIN'
  },

  setupConfig: {
    userVerification: {
      kind: 'MANUAL'
    }
  }
});

export const EmailSetupDtoFactory = (): SetupDto => ({
  admin: {
    email: 'xyz@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123',
    role: 'ADMIN'
  },

  setupConfig: {
    userVerification: {
      kind: 'CONFIRM_EMAIL'
    }
  }
});

export const RegexSetupDtoFactory = (): SetupDto => ({
  admin: {
    email: 'xyz@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123',
    role: 'ADMIN'
  },

  setupConfig: {
    userVerification: {
      emailRegex: 'some_regex',
      kind: 'REGEX_EMAIL'
    }
  }
});
