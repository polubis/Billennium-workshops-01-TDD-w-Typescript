import { form } from '..';

describe('form()', () => {
  describe('in setup phase', () => {
    it('throws on invalid initial values', () => {
      const _PROBES_ = [null, undefined, 1, '', [], true];

      _PROBES_.forEach((probe) => {
        expect(() => form(probe)).toThrow();
      });
    });

    it('saves initial values', () => {
      const _PROBES_ = [
        [
          { username: 'piotr', code: 2234 },
          { username: 'piotr', code: 2234 },
        ],
        [{ username: 'piotr' }, { username: 'piotr' }],
      ];

      _PROBES_.forEach(([probe, result]) => {
        expect(form(probe).values).toEqual(result);
      });
    });

    it('saves validators', () => {
      const loginForm = form({ username: '' }, { username: [(value) => value !== ''] });

      expect(loginForm.fns).toEqual({
        username: [(value) => value !== ''],
      });
    });

    it('sets validation result', () => {
      const loginForm = form({ username: '', code: 222 }, { username: [(value) => value !== ''] });

      expect(loginForm.errors).toEqual({
        username: true,
        code: false,
      });
    });

    it('sets invalid state', () => {
      const loginForm = form({ username: '', code: 222 }, { username: [(value) => value !== ''] });

      expect(loginForm.invalid).toBe(true);
    });

    it('sets touched state', () => {
      const loginForm = form({ username: '', code: 222 }, { username: [(value) => value !== ''] });

      expect(loginForm.touched).toBe(false);
    });

    it('sets dirty state', () => {
      const loginForm = form({ username: '', code: 222 }, { username: [(value) => value !== ''] });

      expect(loginForm.dirty).toBe(false);
    });
  });
});
