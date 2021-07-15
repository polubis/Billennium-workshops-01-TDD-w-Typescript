/*
  Dodaliśmy kilka początkowych modeli w celu zrozumienia API naszej biblioteki. Narazie są to modele bardzo proste, które z czasem będą
  bardziej precyzyjne.
*/

export type Dictionary = Record<string, any>;

export type Fn<V, R> = (value: V) => R;

export type Fns<V, R> = {
  [K in keyof V]?: Fn<V[K], R>[];
};

export type Errors<V extends Dictionary, R> = {
  [K in keyof V]: R;
};

export interface SubmitEvent {
  preventDefault: () => void;
}

export type CheckResultStrategy<V extends Dictionary, R> = (values: V, fns: Fns<V, R>) => CheckResult<V, R>;

export interface CheckResult<V extends Dictionary, R> {
  invalid: boolean;
  errors: Errors<V, R>;
}

/*
  Model danych.
*/
export interface FormData<V extends Dictionary, R> extends CheckResult<V, R> {
  dirty: boolean;
  fns: Fns<V, R>;
  touched: boolean;
  values: V;
}

export interface InitFormData<V extends Dictionary, R>
  extends Pick<FormData<V, R>, 'dirty' | 'fns' | 'values' | 'touched'> {}

/*
  Kontrakt obsługi przejścia z jednego stanu w drugi oraz modyfikacji danych.
*/
export interface Formable<V extends Dictionary, R> {
  next(patchedValues: Partial<V>): Form<V, R>;
  set(patchedValues: Partial<V>): void;
  submit(e?: SubmitEvent): Form<V, R>;
  check(): CheckResult<V, R>;
}

/*
  Całosciowy model biblioteki.
*/
export type Form<V extends Dictionary, R> = FormData<V, R> & Formable<V, R>;
