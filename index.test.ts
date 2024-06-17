import { assert } from "jsr:@std/assert@^0.226.0/assert";
import {
  $any,
  $array,
  $bigint,
  $boolean,
  $const,
  $email,
  $enum,
  $intersection,
  $null,
  $nullable,
  $number,
  $numberRange,
  $numericString,
  $object,
  $optional,
  $record,
  $regexp,
  $string,
  $symbol,
  $tuple,
  $undefined,
  $union,
  $url,
  $uuid,
} from "./index.ts";

Deno.test("$const", async (t) => {
  await t.step("string", () => {
    const strLiteral = $const("A");
    assert(strLiteral("A"));
    assert(!strLiteral("B"));
    assert(!strLiteral(1));
  });

  await t.step("number", () => {
    const numLiteral = $const(42);
    assert(numLiteral(42));
    assert(!numLiteral(43));
    assert(!numLiteral("42"));
  });

  await t.step("boolean", () => {
    const boolLiteral = $const(true);
    assert(boolLiteral(true));
    assert(!boolLiteral(false));
    assert(!boolLiteral("true"));
  });

  await t.step("symbol", () => {
    const symLiteral = $const(Symbol("test"));
    assert(!symLiteral(Symbol("test2")));
    assert(!symLiteral("test"));
  });

  await t.step("undefined", () => {
    const undefLiteral = $const(undefined);
    assert(undefLiteral(undefined));
    assert(!undefLiteral(null));
    assert(!undefLiteral(0));
  });

  await t.step("void", () => {
    const voidLiteral = $const(void 0);
    assert(voidLiteral(void 0));
    assert(!voidLiteral(null));
    assert(!voidLiteral(""));
  });
});

Deno.test("$number", () => {
  assert($number(1));
  assert(!$number("1"));
  assert(!$number(undefined));
  assert(!$number(true));
  assert(!$number(null));
  assert(!$number(Symbol("test")));
  assert(!$number(BigInt(10)));
  assert(!$number({}));
});

Deno.test("$string", () => {
  assert($string("abc"));
  assert(!$string(123));
  assert(!$string(true));
  assert(!$string({}));
  assert(!$string([]));
  assert(!$string(undefined));
  assert(!$string(null));
  assert(!$string(Symbol("11")));
  assert(!$string(BigInt(1)));
});

Deno.test("$numericString", () => {
  assert($numericString("111"));
  assert($numericString("0.3"));
  assert($numericString("-123"));
  assert($numericString("9.99"));
  assert(!$numericString("abc"));
  assert(!$numericString(""));
  assert(!$numericString(" "));
  assert(!$numericString("NaN"));
  assert(!$numericString("Infinity"));
  assert(!$numericString(NaN));
  assert(!$numericString(Infinity));
  assert(!$numericString(null));
  assert(!$numericString(undefined));
  assert(!$numericString(false));
  assert(!$numericString(true));
  assert(!$numericString(0));
  assert(!$numericString(void 0));
  assert(!$numericString([]));
});

Deno.test("$null", () => {
  assert($null(null));
  assert(!$null(1));
  assert(!$null(undefined));
  assert(!$null(""));
  assert(!$null(false));
});

Deno.test("$undefined", () => {
  assert($undefined(undefined));
  assert(!$undefined(null));
  assert(!$undefined(""));
  assert(!$undefined(false));
  assert(!$undefined(0));
});

Deno.test("$any", () => {
  assert($any(""));
  assert($any(1));
  assert($any(0));
  assert($any(null));
  assert($any(undefined));
});

Deno.test("$optional", () => {
  const optionalString = $optional($string);
  assert(optionalString("abc"));
  assert(optionalString(null));
  assert(optionalString(undefined));
  assert(!optionalString(1));
});

Deno.test("$nullable", () => {
  const nullableString = $nullable($string);
  assert(nullableString("abc"));
  assert(nullableString(""));
  assert(nullableString(null));
  assert(!nullableString(undefined));
});

Deno.test("$regexp", () => {
  const regexp = /test/;
  const validator = $regexp(regexp);
  assert(validator("test"));
  assert(validator("a test case"));
  assert(!validator("example"));
  assert(!validator(""));
});

Deno.test("$email", () => {
  assert($email("test@example.com"));
  assert(!$email("not-an-email"));
  assert(!$email("test@"));
  assert(!$email("@example.com"));
  assert(!$email("test@.com"));
  assert(!$email("test@example"));
});

Deno.test("$uuid", () => {
  assert($uuid("123e4567-e89b-12d3-a456-426614174000"));
  assert(!$uuid("not-a-uuid"));
  assert(!$uuid("123e4567-e89b-12d3-a456-42661417400"));
  assert(!$uuid("123e4567e89b12d3a456426614174000"));
});

Deno.test("$url", () => {
  assert($url("https://example.com"));
  assert($url("http://example.com"));
  assert($url("ftp://example.com"));
  assert($url("http://localhost"));
  assert(!$url("not-a-url"));
  assert(!$url(""));
  assert(!$url("example.com"));
});

Deno.test("$symbol", () => {
  assert($symbol(Symbol("test")));
  assert(!$symbol("test"));
  assert(!$symbol(123));
  assert(!$symbol({}));
  assert(!$symbol([]));
  assert(!$symbol(null));
  assert(!$symbol(undefined));
  assert(!$symbol(true));
  assert(!$symbol(false));
});

Deno.test("$bigint", () => {
  assert($bigint(1n));
  assert(!$bigint("1"));
  assert(!$bigint(undefined));
  assert(!$bigint(true));
  assert(!$bigint(null));
  assert(!$bigint(Symbol("test")));
  assert(!$bigint({}));
});

Deno.test("$boolean", () => {
  assert($boolean(true));
  assert($boolean(false));
  assert(!$boolean("true"));
  assert(!$boolean(1));
  assert(!$boolean(null));
  assert(!$boolean(undefined));
  assert(!$boolean([]));
});

Deno.test("$enum", () => {
  const aOrBOrC = $enum(["A", "B", "C"]);
  assert(aOrBOrC("A"));
  assert(aOrBOrC("B"));
  assert(aOrBOrC("C"));
  assert(!aOrBOrC("D"));
  assert(!aOrBOrC(null));
  assert(!aOrBOrC(1));
  assert(!aOrBOrC({}));
  assert(!aOrBOrC([]));
  assert(!aOrBOrC(undefined));
  assert(!aOrBOrC(true));
  assert(!aOrBOrC(Symbol("A")));
});

Deno.test("$intersection", () => {
  const nameWithAge = $intersection(
    [
      $object({
        name: $string,
      }, false),
      $object({
        age: $number,
      }, false),
    ],
  );
  const validObject = { name: "Alice", age: 30 };
  assert(nameWithAge(validObject));
  const invalidObject = { name: "Alice" };
  assert(!nameWithAge(invalidObject));
  const extraObject = { name: "Alice", age: 30, extra: "extra" };
  assert(nameWithAge(extraObject));
});

Deno.test("$union", async (t) => {
  await t.step("string or number", () => {
    const stringOrNumber = $union([$string, $number]);
    assert(stringOrNumber("abc"));
    assert(stringOrNumber(123));
    assert(!stringOrNumber(true));
    assert(!stringOrNumber({}));
    assert(!stringOrNumber([]));
    assert(!stringOrNumber(undefined));
  });
});

Deno.test("$object", () => {
  const nameAndAgeNotExact = $object({
    name: $string,
    age: $number,
  }, false);
  const nameAndAgeExact = $object({
    name: $string,
    age: $number,
  }, true);

  // テストケース
  const validObject = { name: "Alice", age: 30 };
  const invalidObject = { name: "Alice", age: "thirty" };
  const extraPropsObject = { name: "Alice", age: 30, extra: "extra" };
  const missingPropObject = { name: "Alice" };
  const nonObject = 1;
  assert(nameAndAgeNotExact(validObject));
  assert(!nameAndAgeNotExact(invalidObject));
  assert(nameAndAgeNotExact(extraPropsObject));
  assert(!nameAndAgeNotExact(missingPropObject));
  assert(!nameAndAgeNotExact(nonObject));
  assert(nameAndAgeExact(validObject));
  assert(!nameAndAgeExact(invalidObject));
  assert(!nameAndAgeExact(extraPropsObject));
  assert(!nameAndAgeExact(missingPropObject));
  assert(!nameAndAgeExact(nonObject));
});

Deno.test("$array", () => {
  const numberArray = $array($number);
  assert(numberArray([1, 2, 3]));
  assert(!numberArray([1, "2", 3]));
  assert(!numberArray(["1", "2", "3"]));
  assert(numberArray([]));
  assert(!numberArray(["test"]));
  assert(!numberArray([null]));
  assert(!numberArray([true]));
  assert(!numberArray([{}]));
});

Deno.test("$record", () => {
  const record = $record($string);

  // テストケース
  assert(record({ key1: "value1", key2: "value2" }));
  assert(!record({ key1: "value1", key2: 42 }));
  assert(!record(null));
  assert(!record("string"));
  assert(!record(123));
  assert(record({}));
});

Deno.test("$tuple", () => {
  const tupleValidator = $tuple([$string, $number, $boolean]);

  // テストケース
  assert(tupleValidator(["test", 123, true]));
  assert(!tupleValidator(["test", 123]));
  assert(!tupleValidator(["test", "123", true]));
  assert(!tupleValidator([123, "test", true]));
  assert(!tupleValidator([true, 123, "test"]));
});

Deno.test("$numberRange", () => {
  const rangeValidator = $numberRange({ min: 10, max: 20 });
  assert(!rangeValidator(1));
  assert(!rangeValidator(9));
  assert(rangeValidator(10));
  assert(rangeValidator(11));
  assert(rangeValidator(19));
  assert(rangeValidator(20));
  assert(!rangeValidator(21));
  assert(!rangeValidator(30));
  assert(!rangeValidator(undefined));

  const minOnlyValidator = $numberRange({ min: 10 });
  assert(!minOnlyValidator(1));
  assert(!minOnlyValidator(9));
  assert(minOnlyValidator(10));
  assert(minOnlyValidator(11));
  assert(!minOnlyValidator(undefined));

  const maxOnlyValidator = $numberRange({ max: 20 });
  assert(maxOnlyValidator(19));
  assert(maxOnlyValidator(20));
  assert(!maxOnlyValidator(21));
  assert(!maxOnlyValidator(30));
  assert(!maxOnlyValidator(undefined));
});
