import { _SIMPLE_USER_, _VALID_USER_, _INVALID_USER_, userBuilder } from './tests.utils';
import { form } from '..';
import { SubmitEvent } from '../defs';

describe('form()', () => {
  const testPrimitivesExceptionThrow = (creator: (arg: any) => any): void => {
    expect(() => creator(1 as any)).toThrow();
    expect(() => creator('' as any)).toThrow();
    expect(() => creator(null as any)).toThrow();
    expect(() => creator(undefined as any)).toThrow();
    expect(() => creator(Symbol('') as any)).toThrow();
  };

  const testRefTypesExceptionThrow = (creator: (arg: any) => any): void => {
    expect(() => form([] as any)).toThrow();
    expect(() => form(() => '' as any)).toThrow();
  };

  describe('in setup phase', () => {
    describe('throws error for', () => {
      it('primitives', () => {
        testPrimitivesExceptionThrow(form);
      });

      it('all other ref types except object', () => {
        testRefTypesExceptionThrow(form);
      });
    });

    it('accepts objects as initial values', () => {
      expect(() => form({})).not.toThrow();
    });

    it('saves initial values', () => {
      expect(form(_SIMPLE_USER_).values).toEqual(_SIMPLE_USER_);
      expect(form(_VALID_USER_).values).toEqual(_VALID_USER_);
    });

    it('saves validators for later usage', () => {
      const usernameFns = [(value: string) => value !== ''];

      expect(form(_INVALID_USER_, { username: usernameFns }).fns).toEqual({
        username: usernameFns,
      });
    });

    it('assigns empty object literal for empty fns parameter', () => {
      expect(form(_INVALID_USER_, {}).fns).toEqual({});
    });

    it('sets errors as object with boolean values', () => {
      const loginForm = form(_INVALID_USER_, { username: [(value) => value === ''] });

      expect(loginForm.errors).toEqual({
        username: true,
        code: false,
        phone: false,
      });
    });

    it('sets invalid state', () => {
      const loginForm = form(_INVALID_USER_, { username: [(value) => value === ''] });

      expect(loginForm.invalid).toBeTruthy();
    });

    it('sets touched state', () => {
      const loginForm = form(_INVALID_USER_, { username: [(value) => value === ''] });

      expect(loginForm.touched).toBeFalsy();
    });

    it('sets dirty state', () => {
      const loginForm = form(_INVALID_USER_, { username: [(value) => value === ''] });

      expect(loginForm.dirty).toBeFalsy();
    });
  });

  describe('after setup phase', () => {
    const _USERNAME_ = '';
    const _PHONE_ = '111 111 111';

    describe('set()', () => {
      describe('throws error for', () => {
        it('primitives', () => {
          testPrimitivesExceptionThrow(form(_SIMPLE_USER_).set);
        });

        it('all other ref types except object', () => {
          testRefTypesExceptionThrow(form(_SIMPLE_USER_).set);
        });
      });

      it('merges patched values with current ones', () => {
        // arrange
        const loginForm = form(_SIMPLE_USER_);

        // act
        loginForm.set({ username: _USERNAME_, phone: _PHONE_ });

        // assert
        expect(loginForm.values).toEqual(
          userBuilder().setUsername(_USERNAME_).setPhone(_PHONE_).valueOf(),
        );
      });

      it('sets invalid property', () => {
        const loginForm = form(_SIMPLE_USER_, { username: [(value) => value === ''] });

        loginForm.set({ username: _USERNAME_, phone: _PHONE_ });

        expect(loginForm.invalid).toBeTruthy();
      });

      it('sets errors as object with boolean values', () => {
        const loginForm = form(_SIMPLE_USER_, { username: [(value) => value === ''] });

        loginForm.set({ username: _USERNAME_, phone: _PHONE_ });

        expect(loginForm.errors).toEqual({ username: true, code: false, phone: false });
      });

      it('sets touched property', () => {
        const loginForm = form(_SIMPLE_USER_);

        loginForm.set({});

        expect(loginForm.touched).toBeTruthy();
      });
    });

    describe('next()', () => {
      describe('throws error for', () => {
        it('primitives', () => {
          testPrimitivesExceptionThrow(form(_SIMPLE_USER_).next);
        });

        it('all other ref types except object', () => {
          testRefTypesExceptionThrow(form(_SIMPLE_USER_).next);
        });
      });

      it('merges patched values with current ones', () => {
        const loginForm = form(_SIMPLE_USER_);

        expect(loginForm.next({ username: _USERNAME_, phone: _PHONE_ }).values).toEqual(
          userBuilder().setUsername(_USERNAME_).setPhone(_PHONE_).valueOf(),
        );
      });

      it('sets invalid property', () => {
        const loginForm = form(_SIMPLE_USER_, { username: [(value) => value === ''] });

        expect(loginForm.next({ username: _USERNAME_, phone: _PHONE_ }).invalid).toBeTruthy();
      });

      it('sets errors as object with boolean values', () => {
        const loginForm = form(_SIMPLE_USER_, { username: [(value) => value === ''] });

        expect(loginForm.next({ username: _USERNAME_, phone: _PHONE_ }).errors).toEqual({
          username: true,
          code: false,
          phone: false,
        });
      });

      it('sets touched property', () => {
        const loginForm = form(_SIMPLE_USER_);

        expect(loginForm.next({}).touched).toBeTruthy();
      });

      it('clones form object', () => {
        expect(form(userBuilder().valueOf()).next({ username: _USERNAME_ })).not.toEqual(
          form(userBuilder().setUsername(_USERNAME_).valueOf()),
        );
      });
    });

    describe('submit()', () => {
      it('calls prevent defaults method if given', () => {
        const _SUBMIT_EVENT_: SubmitEvent = { preventDefault: () => {} };
        const spy = jest.spyOn(_SUBMIT_EVENT_, 'preventDefault');

        form(_SIMPLE_USER_).submit(_SUBMIT_EVENT_);

        expect(spy).toHaveBeenCalledTimes(1);

        jest.clearAllMocks();
      });

      it('sets invalid property', () => {
        const loginForm = form(_INVALID_USER_, { username: [(value) => value === ''] });

        expect(loginForm.submit().invalid).toBeTruthy();
      });

      it('sets errors as object with boolean values', () => {
        const loginForm = form(_INVALID_USER_, { username: [(value) => value === ''] });

        expect(loginForm.submit().errors).toEqual({
          username: true,
          code: false,
          phone: false,
        });
      });

      it('sets dirty property', () => {
        expect(form({}).submit().dirty).toBeTruthy();
      });

      it('clones form object', () => {
        expect(form(userBuilder().valueOf()).submit()).not.toEqual(form(userBuilder().valueOf()));
      });
    });
  });

  describe('check()', () => {
    it('returns truthy invalid when errors occurs', () => {
      expect(
        form(_INVALID_USER_, { username: [(value) => value === ''] }).check().invalid,
      ).toBeTruthy();
    });

    it('returns truthy errors when single value is invalid', () => {
      expect(form(_INVALID_USER_, { username: [(value) => value === ''] }).check().errors).toEqual({
        username: true,
        code: false,
        phone: false,
      });
    });
  });
});
