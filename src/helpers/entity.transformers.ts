import { TransformFnParams } from 'class-transformer';

export const roundFloatTransformer = ({ value }: TransformFnParams) =>
  +parseFloat(value).toFixed(2);

export const decimalTransformer = {
  to: (value: string | number) => value,
  from: (value: string) => parseFloat(value),
};
