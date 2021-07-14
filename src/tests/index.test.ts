import { _USERS_ } from './tests.utils';
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
      expect(form(_USERS_[0]).values).toEqual(_USERS_[0]);
      expect(form(_USERS_[1]).values).toEqual(_USERS_[1]);
    });

    it('saves validators for later usage', () => {
      const usernameFns = [(value: string) => value !== ''];

      expect(form(_USERS_[2], { username: usernameFns }).fns).toEqual({
        username: usernameFns,
      });
    });

    it('assigns empty object literal for empty fns parameter', () => {
      expect(form(_USERS_[2], {}).fns).toEqual({});
    });

    it('sets errors as object with boolean values', () => {
      const loginForm = form(_USERS_[2], { username: [(value) => value === ''] });

      expect(loginForm.errors).toEqual({
        username: true,
        code: false,
        phone: false,
      });
    });

    it('sets invalid state', () => {
      const loginForm = form(_USERS_[2], { username: [(value) => value === ''] });

      expect(loginForm.invalid).toBe(true);
    });

    it('sets touched state', () => {
      const loginForm = form(_USERS_[2], { username: [(value) => value === ''] });

      expect(loginForm.touched).toBe(false);
    });

    it('sets dirty state', () => {
      const loginForm = form(_USERS_[2], { username: [(value) => value === ''] });

      expect(loginForm.dirty).toBe(false);
    });
  });

  describe('after setup phase', () => {
    describe('set()', () => {
      describe('throws error for', () => {
        it('primitives', () => {});

        it('all other ref types except object', () => {});
      });

      it('sets partial values', () => {});

      it('runs validation after set', () => {});

      it('sets invalid property', () => {});

      it('sets errors as object with boolean values', () => {});

      it('sets touched property', () => {});
    });

    describe('next()', () => {
      describe('throws error for', () => {
        it('primitives', () => {});

        it('all other ref types except object', () => {});
      });

      it('sets partial values', () => {});

      it('runs validation after set', () => {});

      it('sets invalid property', () => {});

      it('sets errors as object with boolean values', () => {});

      it('sets touched property', () => {});

      it('clones form object', () => {});
    });
  });
});
