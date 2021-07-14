import { form } from '..';

describe('form()', () => {
  describe('in setup phase', () => {
    describe('throws error for', () => {
      it('primitives', () => {
        expect(() => form(1 as any)).toThrow();
        expect(() => form('' as any)).toThrow();
        expect(() => form(null as any)).toThrow();
        expect(() => form(undefined as any)).toThrow();
        expect(() => form(Symbol('') as any)).toThrow();
      });

      it('all other ref types except object', () => {
        expect(() => form([] as any)).toThrow();
        expect(() => form(() => '' as any)).toThrow();
      });
    });

    it('accepts objects as initial values', () => {
      expect(() => form({})).not.toThrow();
    });

    it('saves initial values', () => {
      expect(form({ username: 'piotr', code: 2234 }).values).toEqual({
        username: 'piotr',
        code: 2234,
      });
      expect(form({ username: 'piotr' }).values).toEqual({ username: 'piotr' });
    });

    it('saves validators for later usage', () => {
      const usernameFns = [(value: string) => value !== ''];

      expect(form({ username: '' }, { username: usernameFns }).fns).toEqual({
        username: usernameFns,
      });
    });

    it('assigns empty object literal for empty fns parameter', () => {
      expect(form({ username: '' }, {}).fns).toEqual({});
    });

    it('sets errors as object with boolean values', () => {
      const loginForm = form({ username: '', code: 222 }, { username: [(value) => value === ''] });

      expect(loginForm.errors).toEqual({
        username: true,
        code: false,
      });
    });

    it('sets invalid state', () => {
      const loginForm = form({ username: '', code: 222 }, { username: [(value) => value === ''] });

      expect(loginForm.invalid).toBe(true);
    });

    it('sets touched state', () => {
      const loginForm = form({ username: '', code: 222 }, { username: [(value) => value === ''] });

      expect(loginForm.touched).toBe(false);
    });

    it('sets dirty state', () => {
      const loginForm = form({ username: '', code: 222 }, { username: [(value) => value === ''] });

      expect(loginForm.dirty).toBe(false);
    });
  });
});
