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
});
