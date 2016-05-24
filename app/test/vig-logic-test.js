/**
 * @file A nice file for testing smart logical vigenere functions.
 * @author Victor Tranell <victr593@student.liu.se>
 * @author Erik Rönmark <eriro331@student.liu.se>
 */


QUnit.test("test caesarLookup with good parameter", function(){
    var ENG_ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var SWE_ALPHA = ENG_ALPHA + "ÅÄÖ";
    equal(caesarLookUp("A","E", ENG_ALPHA), "W", "caesar lookup is incorrect");
    equal(caesarLookUp("X", "C", ENG_ALPHA), "V", "caesar lookup is" +
        " incorrrect");
    equal(caesarLookUp("A","E", SWE_ALPHA), "Z", "caesar lookup is incorrect");
    equal(caesarLookUp("X", "C", SWE_ALPHA), "V", "caesar lookup is" +
        " incorrrect");
});

QUnit.test("test caesarLookup with bad parameter", function(){
    var ENG_ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var SWE_ALPHA = ENG_ALPHA + "ÅÄÖ";
    equal(caesarLookUp("Ö","A", ENG_ALPHA), "?", "caesar lookup should return ?");
    raises(function(){
        caesarLookUp("A","Ö", ENG_ALPHA);
    }, Error, "should throw error");
    raises(function(){
        caesarLookUp("","A", SWE_ALPHA);
    }, Error, "should throw error");
    raises(function(){
        caesarLookUp("A","5", ENG_ALPHA);
    }, Error, "should throw error");
    raises(function(){
        caesarLookUp([],"A", ENG_ALPHA);
    }, TypeError, "should throw type error");
    raises(function(){
        caesarLookUp("A",[], ENG_ALPHA);
    }, TypeError, "should throw type error");
    raises(function(){
        caesarLookUp("A",[], 5);
    }, TypeError, "should throw type error");
    raises(function(){
        caesarLookUp(5,[], ENG_ALPHA);
    }, TypeError, "should throw type error");
});

QUnit.test("test dechiperVigenere with good parameter", function(){
    var cry001 = "RVZYBUAGXFXQPCZRVZVRPSGCMÖXEWAOAWZCOYRZEJJEZYÅRATQAOHCTOD" +
        "EAQDHMÅQVZZSORAPVCSRERVZWBTJFPSHANGWOFQÄÄXÖTWOBCCVEMTWEVTOBPCPZUVZ" +
        "ÅVPCCÄSHBÖÖQÄPACVPOBDADQRZZZRCÅRBYVREVASBCWAYSGMRFKÄXQÄUQESXWFTSHC" +
        "WUMUYDCGJXCZFXJCUQEIÄAVZDCXEZXZ";
    var cry001ans = "DENKNIPSLUGEBONDENHADESTÄLLTFRAMKLOCKANTVÅTIMMARFÖRATT" +
        "FÅUTMESTAMÖJLIGAARBETEAVDENINHYRDETRÖSKARENKLOCKANTREVÄCKTEHANDRÄN" +
        "GENMEDROPETSOLENÄRREDANUPPEDINLATMASKEFTERENTIMMESADRÄNGENDETBLIRH" +
        "ETTIDAGHURSÅJONUGÅRDETUPPENSOLTILL";
    var cry014 = "RVMYKÖASOHHMNVFLÄÖOAKHOORDUNVZKQXHYOUHEPOHVMÄUOYKFEZÖWEXZ" +
        "OVKQITBKVNMCUEYAZLXNCMMÄVNPOHHKÄJAACVRWVZGQXVNRSBMMATHPOHVMÄFOXSXT" +
        "MAHHLÄRJMÖMNPLRRMKHTPBZNCOGÅSNVN";
    var cry014ans = "HEMMALAGETHADEFÖRLORATOCHPUBLIKENTYCKTEDETVARDOMARENSF" +
        "ELPÅVÄGUTSAENAVDEMTILLDOMARENDETHÄRVARVERKLIGENENFINMATCHDETVARROL" +
        "IGTATTHÖRAJASYNDBARAATTDUINTESÅGDEN";
    var cry037 = "APXAMTJPXYILRMWAPXJTTZAMVEKPBXKWPUIGLFTTXELWYTQQLLYLMEPVZ" +
        "ZWGLJHFEKVBXZMXPVZAPXOMTKUTZBXYZTJQGNLHDVTZBXLXAPTEAWPHZWZIGHZKVEU" +
        "LVWVVFFVXDJBRM";
    var cry037ans = "THETEACHERASKEDTHECLASSTOWRITEDOWNANEXAMPLEOFMIXEDFEEL" +
        "INGSONEBOYWROTESEEINGTHEHEADMASTERRACINGDOWNASTEEPHILLTOWARDSANARR" +
        "OWBENDONMYNEWBIKE";

    equal(decipherVigenereString(cry001,"ORM","sv"), cry001ans,
        "decipher of cry001 is incorrect");
    equal(decipherVigenereString(cry014,"KRAM","sv"), cry014ans,
        "decipher of cry014 is incorrect");
    equal(decipherVigenereString(cry037,"HIT","en"), cry037ans,
        "decipher of cry037 is incorrect");
    equal(decipherVigenereString("", "ORM", "sv"), "", "decipher" +
    " of empty string should be empty");

});

QUnit.test("test dechiperVigenere with bad parameter", function(){
    raises(function() {
        decipherVigenereString("HelloWorld", "Test", "de");
    },Error,"Language should not be accepted");
    raises(function() {
        decipherVigenereString("HelloWorld", 3, "sv");
    },TypeError,"Should throw a type error");
    raises(function() {
        decipherVigenereString("HelloWorld", "", "sv");
    },Error,"Should throw error");
    raises(function() {
        decipherVigenereString("HelloWorld", "KEY", "");
    },Error,"Should throw error");
    raises(function() {
        decipherVigenereString({}, "KEY", "en");
    },Error,"Should throw error");
    raises(function() {
        decipherVigenereString(5, "KEY", "sv");
    },Error,"Should type error");

});
