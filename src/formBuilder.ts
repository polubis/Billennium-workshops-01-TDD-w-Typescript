import {
  Form,
  Dictionary,
  Fns,
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

const createForm = <V extends Dictionary, R>(
  initFormData: InitFormData<V, R>,
  checkStrategy: CheckResultStrategy<V, R>,
): Form<V, R> => {
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

  const handleNext = (patchedValues: Partial<V>): Form<V, R> => {
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
    e && e.preventDefault();

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

  const handleCheck = (): CheckResult<V, R> => {
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

export const formBuilder =
  <R>(checkStrategy: CheckResultStrategy<Dictionary, R>) =>
  <V extends Dictionary>(initValues: V, initFns: Fns<V, R> = {}) =>
    createForm(
      {
        touched: false,
        dirty: false,
        values: initValues,
        fns: initFns,
      },
      checkStrategy,
    );
