# validators

A module providing validators with type guard.

[![codecov](https://codecov.io/gh/Showichiro/typescript-validators/graph/badge.svg?token=L6ZI8MIAPT)](https://codecov.io/gh/Showichiro/typescript-validators)
[![JSR](https://jsr.io/badges/@showichiro/validators)](https://jsr.io/@showichiro/validators)

```ts
 import {
 type Validator,
 type Optional,
 type Nullable,
 type Infer,
 $const,
 $number,
 $numberRange,
 $string,
 $numericString,
 $null,
 $undefined,
 $any,
 $optional,
 $nullable,
 $regexp,
 $email,
 $uuid,
 $url,
 $symbol,
 $bigint,
 $boolean,
 $enum,
 $intersection,
 $union,
 $object,
 $array,
 $arrayLength,
 $record,
 $tuple
 } from "@showichiro/validators";

 // $const
 const strValidator = $const("hello");
 console.log(strValidator("hello")); // true
 console.log(strValidator("world")); // false

 // $number
 console.log($number(1)); // true
 console.log($number("1")); // false
 
 // $numberRange
 const rangeValidator = $numberRange({ min: 10, max: 20 });
 console.log(rangeValidator(15)); // true
 console.log(rangeValidator(25)); // false

 const minOnlyValidator = $numberRange({ min: 10 });
 console.log(minOnlyValidator(15)); // true
 console.log(minOnlyValidator(5)); // false

 const maxOnlyValidator = $numberRange({ max: 20 });
 console.log(maxOnlyValidator(15)); // true
 console.log(maxOnlyValidator(25)); // false

 // $string
 console.log($string("hello")); // true
 console.log($string(123)); // false

 // $numericString
 console.log($numericString("123")); // true
 console.log($numericString("abc")); // false

 // $null
 console.log($null(null)); // true
 console.log($null("not null")); // false

 // $undefined
 console.log($undefined(undefined)); // true
 console.log($undefined(null)); // false

 // $any
 console.log($any("hello")); // true
 console.log($any(123)); // true

 // $optional
 const optionalString = $optional($string);
 console.log(optionalString("hello")); // true
 console.log(optionalString(null)); // true
 console.log(optionalString(123)); // false

 // $nullable
 const nullableString = $nullable($string);
 console.log(nullableString("hello")); // true
 console.log(nullableString(null)); // true
 console.log(nullableString(undefined)); // false
 console.log(nullableString(123)); // false

 // $regexp
 const validator = $regexp(/test/);
 console.log(validator("test")); // true
 console.log(validator("a test case")); // true
 console.log(validator("example")); // false

 // $email
 console.log($email("test@example.com")); // true
 console.log($email("not-an-email")); // false

 // $uuid
 console.log($uuid("123e4567-e89b-12d3-a456-426614174000")); // true
 console.log($uuid("not-a-uuid")); // false

 // $url
 console.log($url("https://example.com")); // true
 console.log($url("not-a-url")); // false

 // $symbol
 console.log($symbol(Symbol("test"))); // true
 console.log($symbol("test")); // false

 // $bigint
 console.log($bigint(1n)); // true
 console.log($bigint("1")); // false

 // $boolean
 console.log($boolean(true)); // true
 console.log($boolean("true")); // false

 // $enum
 const colorValidator = $enum(["red", "green", "blue"]);
 console.log(colorValidator("red")); // true
 console.log(colorValidator("yellow")); // false

 // $intersection
 const nameObject = $object({ name: $string }, false);
 const nameWithAge = $intersection([
   nameObject,
   $object({ age: $number }, false),
 ]);
 const validObject = { name: "Alice", age: 30 };
 console.log(nameWithAge(validObject)); // true

 // $union
 const validator = $union([$string, $number]);
 console.log(validator("test")); // true
 console.log(validator(123)); // true
 console.log(validator(true)); // false

 // $object
 const nameAndAgeNotExact = $object({ name: $string, age: $number }, false);
 const nameAndAgeExact = $object({ name: $string, age: $number }, true);
 const validObject = { name: "Alice", age: 30 };
 console.log(nameAndAgeNotExact(validObject)); // true (not exact)
 console.log(nameAndAgeExact(validObject)); // true (exact)

 // $array
 const numberArray = $array($number);
 console.log(numberArray([1, 2, 3])); // true
 console.log(numberArray([1, "2", 3])); // false

 // $arrayLength
 const lengthValidator = $arrayLength({ min: 2, max: 4, child: $number });
 console.log(lengthValidator([1, 2, 3])); // true
 console.log(lengthValidator([1])); // false
 console.log(lengthValidator([1, 2, 3, 4, 5])); // false

 const minOnlyValidator = $arrayLength({ min: 2, child: $number });
 console.log(minOnlyValidator([1, 2, 3])); // true
 console.log(minOnlyValidator([1])); // false

 const maxOnlyValidator = $arrayLength({ max: 4, child: $number });
 console.log(maxOnlyValidator([1, 2, 3])); // true
 console.log(maxOnlyValidator([1, 2, 3, 4, 5])); // false

 // $record
 const stringRecord = $record($string);
 console.log(stringRecord({ key1: "value1", key2: "value2" })); // true
 console.log(stringRecord({ key1: "value1", key2: 42 })); // false

 // $tuple
 const tupleValidator = $tuple([$string, $number, $boolean]);
 console.log(tupleValidator(["test", 123, true])); // true
 console.log(tupleValidator(["test", "123", true])); // false

 // customValidator
 const $customValidator: Validator<CustomType> = (val:unknown): val is CustomType => {...};
```

# referenced

- https://github.com/colinhacks/zod
- https://github.com/mizchi/lizod
