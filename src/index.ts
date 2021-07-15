import { Form, Dictionary, Fns, Errors, FormData, InitFormData } from './defs';

const buildError = (reason: string, message: string): Error => {
  return new Error(`[${reason}]: ${message}`);
};

const validateValuesShape = (values: any): void => {
  if (!values || Array.isArray(values) || typeof values !== 'object') {
    throw buildError('values shape', 'Values parameter must be an object');
  }
};

const generateErrors = <V extends Dictionary>(values: V, fns: Fns<V>): Errors<V> => {
  const keys = Object.keys(values);

  return keys.reduce((acc, key): Errors<V> => {
    const value = values[key];
    const valueFns = fns[key];

    return {
      ...acc,
      [key]: Array.isArray(valueFns) ? valueFns.some((fn) => fn(value)) : false,
    };
  }, {} as Errors<V>);
};

const isFormInvalid = <V extends Dictionary>(errors: Errors<V>): boolean =>
  Object.keys(errors).some((key) => errors[key]);


// Factory function
const createForm = <V extends Dictionary>(initFormData: InitFormData<V>) => {
  validateValuesShape(initFormData.values);

  let fns = initFormData.fns;
  let values = { ...initFormData.values };
  let errors = generateErrors(values, fns);
  let invalid = isFormInvalid(errors);
  let dirty = false;
  let touched = initFormData.touched;

  const handleSet = (patchedValues: Partial<V>): void => {
    validateValuesShape(patchedValues);

    values = { ...values, ...patchedValues };
    errors = generateErrors(values, fns);
    invalid = isFormInvalid(errors);
    touched = true;
  };

  const handleNext = (patchedValues: Partial<V>): Form<V> => {
    handleSet(patchedValues);

    return createForm({
      fns,
      values,
      dirty,
      touched,
    });
  };

  return {
    get values() {
      return values;
    },
    get errors() {
      return errors;
    },
    get invalid() {
      return invalid;
    },
    get fns() {
      return fns;
    },
    get dirty() {
      return dirty;
    },
    get touched() {
      return touched;
    },
    set: handleSet,
    next: handleNext,
  } as any;
};

export const form = <V extends Dictionary>(initValues: V, initFns: Fns<V> = {}): Form<V> => {
  return createForm({
    touched: false,
    dirty: false,
    values: initValues,
    fns: initFns,
  });
};
