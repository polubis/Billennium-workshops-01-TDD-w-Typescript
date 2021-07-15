import {
  Form,
  Dictionary,
  Fns,
  Errors,
  InitFormData,
  SubmitEvent,
  CheckResult,
  CheckResultStrategy,
} from './defs';

const buildError = (reason: string, message: string): Error => {
  return new Error(`[${reason}]: ${message}`);
};

const validateValuesShape = (values: any): void => {
  if (!values || Array.isArray(values) || typeof values !== 'object') {
    throw buildError('values shape', 'Values parameter must be an object');
  }
};

// Factory function
const createForm = <V extends Dictionary>(
  initFormData: InitFormData<V>,
  checkStrategy: CheckResultStrategy<V>,
): Form<V> => {
  validateValuesShape(initFormData.values);

  let fns = initFormData.fns;
  let values = { ...initFormData.values };
  let { errors, invalid } = checkStrategy(values, fns);
  let dirty = initFormData.dirty;
  let touched = initFormData.touched;

  const handleSet = (patchedValues: Partial<V>): void => {
    validateValuesShape(patchedValues);

    values = { ...values, ...patchedValues };

    const result = checkStrategy(values, fns);
    errors = result.errors;
    invalid = result.invalid;
    touched = true;
  };

  const handleNext = (patchedValues: Partial<V>): Form<V> => {
    handleSet(patchedValues);

    return createForm(
      {
        fns,
        values,
        dirty,
        touched,
      },
      checkStrategy,
    );
  };

  const handleSubmit = (e?: SubmitEvent) => {
    e && e?.preventDefault();

    return createForm(
      {
        fns,
        values,
        dirty: true,
        touched,
      },
      checkStrategy,
    );
  };

  const handleCheck = (): CheckResult<V> => {
    return checkStrategy(values, fns);
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

const booleanStrategy = <V extends Dictionary>(values: V, fns: Fns<V>): CheckResult<V> => {
  const keys = Object.keys(values);

  const errors = keys.reduce((acc, key): Errors<typeof values> => {
    const value = values[key];
    const valueFns = fns[key];

    return {
      ...acc,
      [key]: Array.isArray(valueFns) ? valueFns.some((fn) => fn(value)) : false,
    };
  }, {} as Errors<V>);
  const invalid = keys.some((key) => errors[key]);

  return {
    errors,
    invalid,
  };
};

export const form = <V extends Dictionary>(initValues: V, initFns: Fns<V> = {}): Form<V> => {
  return createForm(
    {
      touched: false,
      dirty: false,
      values: initValues,
      fns: initFns,
    },
    booleanStrategy,
  );
};
