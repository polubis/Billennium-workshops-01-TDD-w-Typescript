import { CheckResult, Dictionary, Errors, Fns } from './defs';
import { formBuilder } from './formBuilder';

interface SemanticError {
  message: string;
  invalid: boolean;
}

const semanticStrategy = <V extends Dictionary, R = SemanticError>(
  values: V,
  fns: Fns<V, R>,
): CheckResult<V, R> => {
  const keys = Object.keys(values);

  const errors = keys.reduce((acc, key): Errors<V, R> => {
    const value = values[key];
    const valueFns = fns[key];

    return {
      ...acc,
      [key]: {
        message: 'Validation message',
        invalid: Array.isArray(valueFns) ? valueFns.some((fn) => fn(value)) : false,
      } as SemanticError,
    };
  }, {} as Errors<V, R>);
  const invalid = keys.some((key) => errors[key]);

  return {
    errors,
    invalid,
  };
};

export const semanticForm = formBuilder<SemanticError>(semanticStrategy);
