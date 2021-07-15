import { Form, Dictionary, Fns, Errors, InitFormData, SubmitEvent, CheckResult } from './defs';

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

const isInvalid = <V extends Dictionary>(errors: Errors<V>): boolean =>
  Object.keys(errors).some((key) => errors[key]);

const generateCheckResult = <V extends Dictionary>(values: V, fns: Fns<V>): CheckResult<V> => {
  const errors = generateErrors(values, fns);
  const invalid = isInvalid(errors);

  return {
    errors,
    invalid,
  };
};

// Factory function
const createForm = <V extends Dictionary>(initFormData: InitFormData<V>) => {
  validateValuesShape(initFormData.values);

  let fns = initFormData.fns;
  let values = { ...initFormData.values };
  let { errors, invalid } = generateCheckResult(values, fns);
  let dirty = initFormData.dirty;
  let touched = initFormData.touched;

  const handleSet = (patchedValues: Partial<V>): void => {
    validateValuesShape(patchedValues);

    values = { ...values, ...patchedValues };

    const result = generateCheckResult(values, fns);
    errors = result.errors;
    invalid = result.invalid;
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

  const handleSubmit = (e?: SubmitEvent) => {
    e && e?.preventDefault();

    return createForm({
      fns,
      values,
      dirty: true,
      touched,
    });
  };

  const handleCheck = (): CheckResult<V> => {
    return generateCheckResult(values, fns);
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
    submit: handleSubmit,
    check: handleCheck,
  };
};

export const form = <V extends Dictionary>(initValues: V, initFns: Fns<V> = {}): Form<V> => {
  return createForm({
    touched: false,
    dirty: false,
    values: initValues,
    fns: initFns,
  });
};
