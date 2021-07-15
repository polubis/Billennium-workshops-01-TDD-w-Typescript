export interface User {
  username: string;
  phone: string;
  code: number;
}

const createUser = (): User => ({
  username: 'piotr1994',
  phone: '999 229 323',
  code: 2232,
});

export const userBuilder = (user = createUser()) => ({
  valueOf: () => user,
  setUsername: (username: User['username']) => userBuilder({ ...user, username }),
  setPhone: (phone: User['phone']) => userBuilder({ ...user, phone }),
  setCode: (code: User['code']) => userBuilder({ ...user, code }),
});

export const _SIMPLE_USER_ = userBuilder().valueOf();
export const _VALID_USER_ = userBuilder().setUsername('piotr').valueOf();
export const _INVALID_USER_ = userBuilder().setUsername('').valueOf();
