/**
 * Validator Types.
 * @template T
 */
export type Validator<T> = (val: unknown) => val is T;

/**
 * Represents an optional type that can be a value of type T, undefined, or null.
 * @template T
 */
export type Optional<T> = T | undefined | null;

/**
 * Represents a type that can be either of type T or null.
 * @template T
 */
export type Nullable<T> = T | null;

/**
 * Infers the type E from a Validator extending type T.
 * @template T
 */
export type Infer<T> = T extends Validator<infer E> ? E : never;

type InferArray<T extends unknown[]> = T extends [infer First, ...infer Rest]
  ? [Infer<First>, ...InferArray<Rest>]
  : [];

type TupleToIntersection<T extends unknown[]> = {
  [I in keyof T]: (x: T[I]) => void;
}[number] extends (x: infer R) => void ? R : never;

/**
 * A type guard that checks if a value is strictly equal to a predefined constant.
 * @template T - A type that extends number, string, boolean, undefined, void, or symbol.
 * @param {T} def - The constant value to compare against.
 * @returns {Validator<T>} A validator function that checks if a value is strictly equal to the predefined constant.
 * @example
 * const strValidator = $const("hello");
 * console.log(strValidator("hello")); // true
 * console.log(strValidator("world")); // false
 */
export const $const = <
  T extends number | string | boolean | undefined | void | symbol,
>(def: T): Validator<T> =>
(val): val is T => {
  return val === def;
};

/**
 * A type guard that checks if a value is of type number.
 * @returns {val is number} True if the value is a number, false otherwise.
 * @example
 * console.log($number(1)); // true
 * console.log($number("1")); // false
 */
export const $number: Validator<number> = (val): val is number => {
  return typeof val === "number";
};

type NumberRangeArgs = { min?: number; max?: number };

/**
 * Creates a validator for checking if a number falls within a specified range.
 * @param {NumberRangeArgs} param - The range arguments containing min and/or max values.
 * @returns {Validator<number>} A validator function that checks if a number falls within the specified range.
 * @example
 * const rangeValidator = $numberRange({ min: 10, max: 20 });
 * console.log(rangeValidator(15)); // true
 * console.log(rangeValidator(25)); // false
 * @example
 * const minOnlyValidator = $numberRange({ min: 10 });
 * console.log(minOnlyValidator(15)); // true
 * console.log(minOnlyValidator(5)); // false
 * @example
 * const maxOnlyValidator = $numberRange({ max: 20 });
 * console.log(maxOnlyValidator(15)); // true
 * console.log(maxOnlyValidator(25)); // false
 */
export const $numberRange =
  ({ min, max }: NumberRangeArgs): Validator<number> =>
  (
    val,
  ): val is number => {
    return $number(val) && (!$number(min) || min <= val) &&
      (!$number(max) || max >= val);
  };

/**
 * A type guard that checks if a value is of type string.
 * @returns {val is string} True if the value is a string, false otherwise.
 * @example
 * console.log($string("hello")); // true
 * console.log($string(123)); // false
 */
export const $string: Validator<string> = (val): val is string => {
  return typeof val === "string";
};

/**
 * A type guard that checks if a value is a numeric string.
 * @returns {val is string} True if the value is a numeric string, false otherwise.
 * @example
 * console.log($numericString("123")); // true
 * console.log($numericString("abc")); // false
 */
export const $numericString: Validator<string> = (val): val is string => {
  if (!$string(val)) {
    return false;
  }
  return !Number.isNaN(parseInt(val));
};

/**
 * A type guard that checks if a value is null.
 * @returns {val is null} True if the value is null, false otherwise.
 * @example
 * console.log($null(null)); // true
 * console.log($null("not null")); // false
 */
export const $null: Validator<null> = (val): val is null => {
  return val === null;
};

/**
 * A type guard that checks if a value is of type undefined.
 * @returns {val is undefined} True if the value is undefined, false otherwise.
 * @example
 * console.log($undefined(undefined)); // true
 * console.log($undefined(null)); // false
 */
export const $undefined: Validator<undefined> = (val): val is undefined => {
  return val === undefined;
};

/**
 * A type guard that allows any value type.
 * @returns {val is any} Always returns true.
 * @example
 * console.log($any("hello")); // true
 * console.log($any(123)); // true
 */
// deno-lint-ignore no-explicit-any
export const $any: Validator<any> = (_val): _val is any => {
  return true;
};

/**
 * A type guard that allows a value to be either of type T or null/undefined.
 * @template T - The type of the value that the validator checks.
 * @param {Validator<T>} validator - A validator function for the type T.
 * @returns {Validator<Optional<T>>} A validator function that checks if a value is either of type T or null/undefined.
 * @example
 * const optionalString = $optional($string);
 * console.log(optionalString("hello")); // true
 * console.log(optionalString(null)); // true
 * console.log(optionalString(123)); // false
 */
export const $optional =
  <T>(validator: Validator<T>): Validator<Optional<T>> =>
  (val): val is Optional<T> => {
    return val == null || validator(val);
  };

/**
 * A type guard that allows a value to be either of type T or null.
 * @template T - The type of the value that the validator checks.
 * @param {Validator<T>} validator - A validator function for the type T.
 * @returns {Validator<Nullable<T>>} A validator function that checks if a value is either of type T or null.
 * @example
 * const nullableString = $nullable($string);
 * console.log(nullableString("hello")); // true
 * console.log(nullableString(null)); // true
 * console.log(nullableString(undefined)); // false
 * console.log(nullableString(123)); // false
 */
export const $nullable =
  <T>(validator: Validator<T>): Validator<Nullable<T>> =>
  (val): val is Nullable<T> => {
    return $null(val) || validator(val);
  };

/**
 * A type guard that checks if a value matches a regular expression.
 * @param {RegExp} regexp - The regular expression to test the value against.
 * @returns {Validator<string>} A validator function that checks if a value matches the given regular expression.
 * @example
 * const validator = $regexp(/test/);
 * console.log(validator("test")); // true
 * console.log(validator("a test case")); // true
 * console.log(validator("example")); // false
 */
export const $regexp =
  (regexp: RegExp): Validator<string> => (val): val is string => {
    return typeof val === "string" && regexp.test(val);
  };

/**
 * A type guard that checks if a value is a valid email.
 * @returns {Validator<string>} A validator function that checks if a value is a valid email.
 * @example
 * console.log($email("test@example.com")); // true
 * console.log($email("not-an-email")); // false
 */
export const $email: Validator<string> = $regexp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

/**
 * A regular expression validator that checks if a value is a valid UUID.
 * @const
 * @type {Validator<string>}
 * @example
 * console.log($uuid("123e4567-e89b-12d3-a456-426614174000")); // true
 * console.log($uuid("not-a-uuid")); // false
 */
export const $uuid: Validator<string> = $regexp(
  /([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})/,
);

/**
 * A type guard that checks if a value is a valid URL.
 * @returns {Validator<string>} A validator function that checks if a value is a valid URL.
 * @example
 * console.log($url("https://example.com")); // true
 * console.log($url("not-a-url")); // false
 */
export const $url: Validator<string> = (val): val is string => {
  if (typeof val !== "string") {
    return false;
  }
  try {
    new URL(val);
    return true;
  } catch (_e: unknown) {
    return false;
  }
};

/**
 * A type guard that checks if a value is of type symbol.
 * @returns {val is symbol} True if the value is a symbol, false otherwise.
 * @example
 * console.log($symbol(Symbol("test"))); // true
 * console.log($symbol("test")); // false
 */
export const $symbol: Validator<symbol> = (val): val is symbol => {
  return typeof val === "symbol";
};

/**
 * A type guard that checks if a value is of type bigint.
 * @returns {val is bigint} True if the value is a bigint, false otherwise.
 * @example
 * console.log($bigint(1n)); // true
 * console.log($bigint("1")); // false
 */
export const $bigint: Validator<bigint> = (val): val is bigint => {
  return typeof val === "bigint";
};

/**
 * A type guard that checks if a value is of type boolean.
 * @returns {val is boolean} True if the value is a boolean, false otherwise.
 * @example
 * console.log($boolean(true)); // true
 * console.log($boolean("true")); // false
 */
export const $boolean: Validator<boolean> = (val): val is boolean => {
  return typeof val === "boolean";
};

/**
 * A type guard that checks if a value is among a predefined set of strings.
 * @template E - The type of the predefined string values.
 * @param {readonly E[]} enums - An array of valid string values.
 * @returns {Validator<E>} A validator function that checks if a value is among the predefined set of strings.
 * @example
 * const colorValidator = $enum(["red", "green", "blue"]);
 * console.log(colorValidator("red")); // true
 * console.log(colorValidator("yellow")); // false
 */
export const $enum =
  <const E extends readonly string[]>(enums: E): Validator<E[number]> =>
  (input: unknown): input is E[number] => {
    if (!$string(input)) {
      return false;
    }
    return enums.includes(input);
  };

/**
 * Creates a validator function that checks if a value satisfies all supplied validator functions.
 * @template Vs - An array of validator functions.
 * @param {readonly [...Vs]} validators - An array of validator functions.
 * @returns {Validator<TupleToIntersection<InferArray<Vs>>>} A validator function that checks if a value satisfies all supplied validator functions.
 * @example
 * const nameObject = $object({ name: $string }, false);
 * const nameWithAge = $intersection([
 *   nameObject,
 *   $object({ age: $number }, false),
 * ]);
 * const validObject = { name: "Alice", age: 30 };
 * console.log(nameWithAge(validObject)); // true
 */
export const $intersection = <Vs extends Validator<unknown>[]>(
  validators: readonly [...Vs],
): Validator<TupleToIntersection<InferArray<Vs>>> => {
  return ((val): val is TupleToIntersection<InferArray<Vs>> => {
    let failed = false;
    for (const validator of validators) {
      if (!validator(val)) {
        failed = true;
      }
    }
    return !failed;
  });
};

/**
 * Creates a validator that checks if a value matches any of the provided validators.
 * @template Vs - An array of validator functions.
 * @param {readonly [...Vs]} validators - An array of validator functions.
 * @returns {Validator<Infer<Vs[number]>>} A validator function that checks if a value matches any of the provided validators.
 * @example
 * const validator = $union([$string, $number]);
 * console.log(validator("test")); // true
 * console.log(validator(123)); // true
 * console.log(validator(true)); // false
 */
export const $union = <Vs extends Validator<unknown>[]>(
  validators: readonly [...Vs],
): Validator<Infer<Vs[number]>> => {
  return (val): val is Infer<Vs[number]> => {
    for (const validator of validators) {
      if (validator(val)) {
        return true;
      }
    }
    return false;
  };
};

/**
 * A type guard that checks if a value matches a given shape.
 * @template Map - An object where each key's value is a Validator function for that key.
 * @param {Map extends Record<string, Validator<unknown>>} validatorMap - The map containing Validator functions for each key.
 * @param {boolean} exact - Determines if the object must not have extra properties.
 * @returns {Validator<{ [K in keyof Map]: Infer<Map[K]> }>} - A validator function that checks if a value matches the shape specified by the Validator map.
 * @example
 * const nameAndAgeNotExact = $object({ name: $string, age: $number }, false);
 * const nameAndAgeExact = $object({ name: $string, age: $number }, true);
 * const validObject = { name: "Alice", age: 30 };
 * console.log(nameAndAgeNotExact(validObject)); // true (not exact)
 * console.log(nameAndAgeExact(validObject)); // true (exact)
 */
export const $object = <Map extends Record<string, Validator<unknown>>>(
  validatorMap: Map,
  exact: boolean,
): Validator<
  {
    [K in keyof Map]: Infer<Map[K]>;
  }
> => {
  return (val: unknown): val is {
    [K in keyof Map]: Infer<Map[K]>;
  } => {
    if (typeof val !== "object" || val == null) {
      return false;
    }
    const unchecked = new Set(Object.keys(val));
    let failed = false;
    for (const [key, validator] of Object.entries(validatorMap)) {
      if (key === "__proto__") {
        continue;
      }
      if (!validator(val?.[key as keyof typeof val])) {
        failed = true;
      }
      unchecked.delete(key);
    }
    if (failed) {
      return false;
    }
    if (exact) {
      return unchecked.size === 0;
    }
    return true;
  };
};

/**
 * Creates a validator for an array of a specified type.
 * @template T
 * @param {Validator<T>} child - A validator for the type of elements in the array.
 * @returns {Validator<Infer<T>[]>} - A validator that checks if a value is an array of the specified type.
 * @example
 * const numberArray = $array($number);
 * console.log(numberArray([1, 2, 3])); // true
 * console.log(numberArray([1, "2", 3])); // false
 */
export const $array = <
  T extends Validator<unknown>,
>(child: T): Validator<Infer<T>[]> => {
  const fn = (
    val: unknown,
  ): val is Array<Infer<T>> => {
    if (!Array.isArray(val)) return false;
    let failed = false;
    for (const value of val.values()) {
      if (!child(value)) {
        failed = true;
      }
    }
    return !failed;
  };
  return fn;
};

type ArrayLengthArgs<T extends Validator<unknown>> = {
  min?: number;
  max?: number;
  child: T;
};

/**
 * Creates a validator for an array with length constraints.
 * @template T - The type of the array elements.
 * @param {ArrayLengthArgs} param - The parameters for the array length constraint.
 * @param {number} [param.max] - The maximum length of the array.
 * @param {number} [param.min] - The minimum length of the array.
 * @param {T} [param.child] - A validator for the type of the array elements.
 * @returns {Validator<Infer<T>[]>} - A validator that checks if the array meets the constraints.
 * @example
 * const lengthValidator = $arrayLength({ min: 2, max: 4, child: $number });
 * console.log(lengthValidator([1, 2, 3])); // true
 * console.log(lengthValidator([1])); // false
 * console.log(lengthValidator([1, 2, 3, 4, 5])); // false
 * @example
 * const minOnlyValidator = $arrayLength({ min: 2, child: $number });
 * console.log(minOnlyValidator([1, 2, 3])); // true
 * console.log(minOnlyValidator([1])); // false
 * @example
 * const maxOnlyValidator = $arrayLength({ max: 4, child: $number });
 * console.log(maxOnlyValidator([1, 2, 3])); // true
 * console.log(maxOnlyValidator([1, 2, 3, 4, 5])); // false
 */
export const $arrayLength = <T extends Validator<unknown>>(
  { max, min, child }: ArrayLengthArgs<T>,
): Validator<Infer<T>[]> => {
  return (val): val is Infer<T>[] => {
    const arrayValidator = $array(child);
    return arrayValidator(val) && (min === undefined || val.length >= min) &&
      (max === undefined || val.length <= max);
  };
};

/**
 * A type guard that checks if values in an object adhere to a specific validator.
 * @template T - The validator type.
 * @param {Validator<unknown>} valueValidator - A validator for the type of object values.
 * @returns {Validator<{ [K in string | number | symbol]: Infer<T> }>} A validator function for the object with validated values.
 * @example
 * const stringRecord = $record($string);
 * console.log(stringRecord({ key1: "value1", key2: "value2" })); // true
 * console.log(stringRecord({ key1: "value1", key2: 42 })); // false
 */
export const $record = <T extends Validator<unknown>>(
  valueValidator: T,
): Validator<
  {
    [K in string | number | symbol]: Infer<T>;
  }
> => {
  return (val): val is {
    [K in string | number | symbol]: Infer<T>;
  } => {
    if (typeof val !== "object" || val === null) {
      return false;
    }
    let failed = false;
    const keyValidator = $union([$string, $number, $symbol]);
    for (const [key, value] of Object.entries(val)) {
      if (key === "__proto__") {
        continue;
      }
      if (!keyValidator(key)) {
        failed = true;
      }
      if (!valueValidator(value)) {
        failed = true;
      }
    }
    return !failed;
  };
};

/**
 * Creates a validator for a tuple of specific types.
 * @template T - Array of tuple element validators.
 * @param {readonly [...{ [I in keyof T]: Validator<T[I]> }]} children - Validators for each element in the tuple.
 * @returns {Validator<T>} - A validator that checks if a value is a tuple of the specified types.
 * @example
 * const tupleValidator = $tuple([$string, $number, $boolean]);
 * console.log(tupleValidator(["test", 123, true])); // true
 * console.log(tupleValidator(["test", "123", true])); // false
 */
export const $tuple = <T extends unknown[]>(
  children: readonly [...{ [I in keyof T]: Validator<T[I]> }],
): Validator<T> => {
  const fn = (
    val: unknown,
  ): val is T => {
    if (!Array.isArray(val)) return false;
    if (val.length !== children.length) {
      return false;
    }
    let failed = false;
    for (const [key, value] of val.entries()) {
      const validator = children[key];
      if (!validator(value)) {
        failed = true;
      }
    }
    return !failed;
  };
  return fn;
};
