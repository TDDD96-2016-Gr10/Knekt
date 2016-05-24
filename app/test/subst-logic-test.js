/**
 * Created by Kim on 2016-03-02.
 */

QUnit.test("test getDuplicates", function() {
    deepEqual(getDuplicates("aabc".split("")),
            {"a":2}, "getDupes should return an object");
    deepEqual(getDuplicates([]),
            {}, "getDupes should return empty object on empty array");
    raises(function() {
        getDuplicates({});
    }, Error, "should toss an error for non-length object");
    deepEqual(getDuplicates("aabbaac".split("")),
            {a:4, b:2}, "getDupes should not care about where the dupes are");
    deepEqual(getDuplicates("bbaa".split("")),
            {b:2, a:2}, "getDupes is an unstable iterator");
});

QUnit.test("test alphabet and decryptLine", function() {
    var ab = initAlphabet("sv");
    equal(ab["a"], undefined, "keys should be capital");
    notEqual(ab["A"], undefined, "swedish should contain the letter A");
    notEqual(ab["Ö"], undefined, "swedish should contain the letter Ö");

    deepEqual(decryptLine("abc", {a:"e", b:"d", c:"b"}),
            "edb", "should work for 3 chars");
    deepEqual(decryptLine("abc", {a:1, b:2, c:3,d:4}),
            "123", "should not care what chars it substitutes");
    deepEqual(decryptLine("dcb", {d:"e", c:"f", b:"g"}),
            "efg", "should be order independent");
    deepEqual(decryptLine("", {}),
            "", "empty string should translate into empty string");
});
