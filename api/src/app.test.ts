import type { SetupOptions, SetupState } from '@databank/core';
import { e2e } from '@douglasneuroinformatics/libnest/testing';

e2e((describe) => {
  describe('documentation', (it) => {
    it('should configure the documentation html', async ({ api, expect }) => {
      const response = await api.get('/');
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
    });
    it('should configure the documentation spec', async ({ api, expect }) => {
      const response = await api.get('/spec.json');
      expect(response.status).toBe(200);
    });
  });
  describe('setup', (it) => {
    it('should initially not be setup', async ({ api, expect }) => {
      const response = await api.get('/v1/setup');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ isSetup: false } satisfies SetupState);
    });
    it('should allow setting up the app', async ({ api, expect }) => {
      const response = await api.post('/v1/setup').send({
        admin: {
          email: 'admin@example.org',
          firstName: 'Jane',
          lastName: 'Doe',
          password: 'Password123'
        },
        setupConfig: {
          verificationStrategy: {
            kind: 'MANUAL'
          }
        }
      } satisfies SetupOptions);
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({ success: true });
    });
    it('should be setup after initialization', async ({ api, expect }) => {
      const response = await api.get('/v1/setup');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ isSetup: true } satisfies SetupState);
    });
  });
});
