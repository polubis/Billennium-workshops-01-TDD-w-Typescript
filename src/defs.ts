/*
  Dodaliśmy kilka początkowych modeli w celu zrozumienia API naszej biblioteki. Narazie są to modele bardzo proste, które z czasem będą
  bardziej precyzyjne.
*/

export type Dictionary = Record<string, any>;

export type Fn<V> = (value: V) => boolean;

export type Fns<V> = {
  [K in keyof V]?: Fn<V[K]>[];
};

export type Errors<V extends Dictionary> = {
  [K in keyof V]: boolean;
};

export interface SubmitEvent {
  preventDefault: () => void;
}

export interface CheckResult<V extends Dictionary> {
  invalid: boolean;
  errors: Errors<V>;
}

/*
  Model danych.
*/
export interface FormData<V extends Dictionary> extends CheckResult<V> {
  dirty: boolean;
  fns: Fns<V>;
  touched: boolean;
  values: V;
}

export interface InitFormData<V extends Dictionary>
  extends Pick<FormData<V>, 'dirty' | 'fns' | 'values' | 'touched'> {}

/*
  Kontrakt obsługi przejścia z jednego stanu w drugi oraz modyfikacji danych.
*/
export interface Formable<V extends Dictionary> {
  next(patchedValues: Partial<V>): Form<V>;
  set(patchedValues: Partial<V>): void;
  submit(e?: SubmitEvent): Form<V>;
  check(): CheckResult<V>;
}

/*
  Całosciowy model biblioteki.
*/
export type Form<V extends Dictionary> = FormData<V> & Formable<V>;
