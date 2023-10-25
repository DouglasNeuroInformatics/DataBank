import { SetupDto } from '@/setup/dto/setup.dto';

export const manualSetupDtoFactory = (): SetupDto => ({
  admin: {
    email: 'xyz@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123'
  },

  setupConfig: {
    verificationInfo: {
      kind: 'MANUAL_VERIFICATION'
    }
  }
});

export const EmailSetupDtoFactory = (): SetupDto => ({
  admin: {
    email: 'xyz@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123'
  },

  setupConfig: {
    verificationInfo: {
      kind: 'VERIFICATION_UPON_CONFIRM_EMAIL'
    }
  }
});

export const RegexSetupDtoFactory = (): SetupDto => ({
  admin: {
    email: 'xyz@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123'
  },

  setupConfig: {
    verificationInfo: {
      kind: 'VERIFICATION_WITH_REGEX',
      regex: '/*.gmail/'
    }
  }
});
