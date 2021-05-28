export const validString = (value: unknown): value is string => typeof value === `string`;

export const fieldValidator = (prefix: string) => ({
  validateValue: (parent: Record<string, unknown>, field: string, expectedType: `bigint` | `boolean` | `number` | `string`): void => {
    if (typeof parent[field] !== expectedType) throw Error(`${prefix}: Expected '${field}' to have type '${expectedType}', got '${typeof parent[field]}'`);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateArray: (parent: Record<string, unknown>, field: string, elementValidator: (element: any, elementIdx: number) => void) => {
    if (!Array.isArray(parent?.[field])) throw Error(`${prefix}: Expected '${field}' to have type 'array', got '${typeof parent[field]}'`);
    (parent[field] as unknown[]).forEach(elementValidator);
  },
});
