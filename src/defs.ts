/*
  Dodaliśmy kilka początkowych modeli w celu zrozumienia API naszej biblioteki. Narazie są to modele bardzo proste, które z czasem będą
  bardziej precyzyjne.
*/

export type Dictionary = Record<string, any>;

export type Fn<V> = (value: V) => boolean;

export type Fns<V> = {
  [K in keyof V]?: Fn<V[K]>[];
};

/*
  Model danych.
*/
export interface FormData<V extends Dictionary> {
  errors: any;
  dirty: boolean;
  fns: Fns<V>;
  invalid: boolean;
  touched: boolean;
  values: V;
}

/*
  Kontrakt obsługi przejścia z jednego stanu w drugi oraz modyfikacji danych.
*/
export interface Formable<V extends Dictionary> {
  next(): Form<V>;
  set(): void;
  submit(): void;
  check(): any;
}

/*
  Całosciowy model biblioteki.
*/
export type Form<V extends Dictionary> = FormData<V> & Formable<V>;
