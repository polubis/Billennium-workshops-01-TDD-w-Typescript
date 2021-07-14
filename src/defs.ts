/*
  Dodaliśmy kilka początkowych modeli w celu zrozumienia API naszej biblioteki. Narazie są to modele bardzo proste, które z czasem będą
  bardziej precyzyjne.
*/

/*
  Model danych.
*/
export interface FormData {
  errors: any;
  dirty: boolean;
  fns: any;
  invalid: boolean;
  touched: boolean;
  values: any;
}

/*
  Kontrakt obsługi przejścia z jednego stanu w drugi oraz modyfikacji danych.
*/
export interface Formable {
  next(): Form;
  set(): void;
  submit(): void;
  check(): any;
}

/*
  Całosciowy model biblioteki.
*/
export type Form = FormData & Formable;
