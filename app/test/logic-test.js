/**
 * @file A nice file for testing smart logical functions.
 * @author Eric Henziger <erihe763@student.liu.se>
 * @author Erik Rönmark <eriro331@student.liu.se>
 * @author Fredrik Bergstrand <frebe339@student.liu.se>
 * @author Victor Tranell <victr593@student.liu.se>
 */

QUnit.test("test getValuesFromObject() good parameters", function(){
    deepEqual(getValuesFromObject({'B': 4, 'C' : 1.1234}),[4,1.1234],"Testing with numbers failed");
    deepEqual(getValuesFromObject({'B': false, 'C' : true}),[false,true],"Testing with booleans failed");
    deepEqual(getValuesFromObject({'B': "", 'C' : "string"}),["","string"],"Testing with strings failed");
    deepEqual(getValuesFromObject({'B': false, 'C' : "hello", 'd': 55}),[false,"hello",55],"Testing with mix failed");
    deepEqual(getValuesFromObject({'B': [4,5,6], 'C' : [1.1234]}),[[4,5,6],[1.1234]],"Testing with array of numbers failed");
    deepEqual(getValuesFromObject({'B': [false], 'C' : [true,false,false]}),[[false],[true,false,false]],"Testing with booleans failed");
    deepEqual(getValuesFromObject({'B': [""], 'C' : ["string","strin","stri"]}),[[""],["string","strin","stri"]],"Testing with array of strings failed");
});

QUnit.test("test getValuesFromObject() bad parameters", function(){
    raises(function(){
        getValuesFromObject(null);
    },TypeError,"should throw typeError");
    raises(function(){
        getValuesFromObject(undefined);
    },TypeError,"should throw typeError");
    raises(function(){
        getValuesFromObject("hello");
    },TypeError,"should throw typeError");
    raises(function(){
        getValuesFromObject(2);
    },TypeError,"should throw typeError");
    raises(function(){
        getValuesFromObject(NaN);
    },TypeError,"should throw typeError");
    raises(function(){
        getValuesFromObject("");
    },TypeError,"should throw typeError");
});

QUnit.test("test buildList()", function () {
    deepEqual(buildList('', 5), ['', '', '', '', ''], "Empty strings failed");
    deepEqual(buildList('', 0), [], "Zero elements failed");
    deepEqual(buildList(3, 1), [3], "One element failed");
});

QUnit.test("test calculateColumns() good parameters", function () {
    deepEqual(calculateColumns(3, ''), ['', '', ''], "Empty text failed");
    deepEqual(calculateColumns(2, 'testingtext'), ['tsiget', 'etntx']);
    deepEqual(calculateColumns(1, 'anothertestingtext'), ['anothertestingtext'], "One column failed");
});

QUnit.test("test calculateColumns() bad parameters", function () {
    raises(function () {
        calculateColumns(-1, 'hello');
    }, RangeError, "should throw RangeError");
    raises(function () {
        calculateColumns(0, 'hello');
    }, RangeError, "should throw RangeError");
    raises(function () {
        calculateColumns(3, 5);
    }, TypeError, "should throw TypeError");
    raises(function () {
        calculateColumns(3, undefined);
    }, TypeError, "should throw TypeError");
    raises(function () {
        calculateColumns('', 'hello');
    }, TypeError, "should throw TypeError");
});

QUnit.test("test decryptTransposition()", function () {
    var cry10 = 'KSREEERTEANRLTLIOPFRSEOSJRANAGRHCLKYSAATHTITATPTFREOOSRSP' +
        'NOSFRÖTDLEJANNFPNÅSSBSULBAOTGSEPEEXTDIIFOÖNIRLTALRVAAGTENFAKFTEDEE' +
        'RATRVNKSOGTTIRDHÄJAARLGDAGRVIIATR';
    var decry10 = 'SEKRETERARENTILLPROFESSORNJAGHARLYCKATSATTHITTAPROFESSO' +
        'RNSPORTFÖLJDENFANNSPÅBUSSBOLAGETSEXPEDITIONFÖRTILLVARATAGNAEFFEKTE' +
        'RDETVARKONSTIGTDÄRHARJAGALDRIGVARIT';
    var cry13 = 'NTELINIEFLKACAHEIDÄTUATPPLNLKOESFKTMSOGÄEATRNKLSULHÅEAFTF' +
        'TPÅSNETEAAMMMPÄUPTKDCTETHEOCRAFÅGERDVAGITODEASTTIÄGTVELGNFCNIKAVAS' +
        'ARETDEFRSEENUSTNDUEFNDAERNDÄÅNRFJVRAGRSÄSTRFTAFMGOJAJELUGEERLLTARA' +
        'LSNRAN';
    var decry13 = 'ENLITENFLICKAHADEÄTITUPPALLKONFEKTSOMGÄSTERNASKULLEHAFÅ' +
        'TTPÅFESTENMAMMAUPPTÄCKTEDETOCHFRÅGADEVARTGODISETTAGITVÄGENFLICKANS' +
        'VARADEEFTERENSTUNDSFUNDERANDENÄRFÅRJAGVÄRSTSTRAFFOMJAGLJUGERELLERT' +
        'ALARSANN';
    var cry27 = 'URHÅRFANMNFIMEEEFLNTARIENVENLAGPIRSENBOLMINSATTÄRTEÅFVAMR' +
        'CHORETAKBENMURHÅRFANMNFIMGERAIFEFISRMMABIAMALFÖNERSTEUEFLNTARNESÅA' +
        'LIBDERGOTTOTPLMTSA';
    var decry27 = 'HURFÅRMANINFEMELEFANTERIENVANLIGPERSONBILMANSÄTTERTVÅFR' +
        'AMOCHTREBAKMENHURFÅRMANINFEMGIRAFFERISAMMABILMANFÖSERUTELEFANTERNA' +
        'SÅBLIRDETGOTTOMPLATS';
    var cry71 = 'EHLLUMTSEBSITOEHMRLAOFORHTREIWESHTRESEDINEETGNNIEESROCLUSD' +
        'TEPUHAAEETGNNIEEFFCIEITNNEUOHGOTURANERRFGIRETARONACDOOOLFFPAROITNO' +
        'FOHTIESRRUORNUIDGNTSAOYNEDISERTDMEEPAR';
    var decry71 = 'HELLMUSTBEISOTHERMALFOROTHERWISETHERESIDENTENGINEERSCOUL' +
        'DSETUPAHEATENGINEEFFICIENTENOUGHTORUNAREFRIGERATORANDCOOLOFFAPORTI' +
        'ONOFTHEIRSURROUNDINGSTOANYDESIREDTEMPERA';
    equal(decryptTransposition(4, [1, 3, 0, 2], cry10), decry10, 'Transposition decryption failed');
    equal(decryptTransposition(5, [2, 0, 3, 4, 1], cry13), decry13, 'Transposition decryption failed');
    equal(decryptTransposition(3, [2, 0, 1], cry27), decry27, 'Transposition decryption failed');
    equal(decryptTransposition(2, [1, 0], cry71), decry71, 'Transposition decryption failed');
});

QUnit.test("test getNGramCount() good parameters", function () {
    var arg1 = 'helloworld';
    var arg2 = 'helloworldwowo';
    var out1 = [
        { ngram: 'HE', num: 1 },
        { ngram: 'EL', num: 1 },
        { ngram: 'LL', num: 1 },
        { ngram: 'LO', num: 1 },
        { ngram: 'OW', num: 1 },
        { ngram: 'WO', num: 1 },
        { ngram: 'OR', num: 1 },
        { ngram: 'RL', num: 1 },
        { ngram: 'LD', num: 1 }];
    var out2 = [
        { ngram: 'HEL', num: 1 },
        { ngram: 'ELL', num: 1 },
        { ngram: 'LLO', num: 1 },
        { ngram: 'LOW', num: 1 },
        { ngram: 'OWO', num: 1 },
        { ngram: 'WOR', num: 1 },
        { ngram: 'ORL', num: 1 },
        { ngram: 'RLD', num: 1 } ];
    var out3 = [
        { ngram: 'L', num: 3 },
        { ngram: 'O', num: 2 },
        { ngram: 'H', num: 1 },
        { ngram: 'E', num: 1 },
        { ngram: 'W', num: 1 },
        { ngram: 'R', num: 1 },
        { ngram: 'D', num: 1 } ];
    var out4 = [
        { ngram: 'WO', num: 3 },
        { ngram: 'OW', num: 2 },
        { ngram: 'HE', num: 1 },
        { ngram: 'EL', num: 1 },
        { ngram: 'LL', num: 1 },
        { ngram: 'LO', num: 1 },
        { ngram: 'OR', num: 1 },
        { ngram: 'RL', num: 1 },
        { ngram: 'LD', num: 1 },
        { ngram: 'DW', num: 1 } ];

    deepEqual(getNGramCount(arg1, 2, 10), out1);
    deepEqual(getNGramCount(arg1, 3, 10), out2);
    deepEqual(getNGramCount(arg1, 1, 10), out3);
    deepEqual(getNGramCount(arg2, 2, 10), out4);
    deepEqual(getNGramCount('foo', 5, 10), []);
    deepEqual(getNGramCount('', 3, 10), []);
});

QUnit.test("test getNGramCount() bad parameters", function () {
    raises(function () {
        getNGramCount(4, 3, 10);
    }, TypeError, "should throw TypeError");
    raises(function () {
        getNGramCount(undefined, 3, 10);
    }, TypeError, "should throw TypeError");
    raises(function () {
        getNGramCount('helloworld', 'foo', 10);
    }, TypeError, "should throw TypeError");
    raises(function () {
        getNGramCount('helloworld', 0, 10);
    }, RangeError, "should throw RangeError");
    raises(function () {
        getNGramCount(null, null, 10);
    }, TypeError, "should throw TypeError");
    raises(function () {
        getNGramCount('helloworld', 1, -1);
    }, RangeError, "should throw RangeError");
    raises(function () {
        getNGramCount('helloworld', 1, undefined);
    }, TypeError, "should throw TypeError");
});

QUnit.test("test countLetterFrequency() with good parameters", function() {
    var ret = {};
    countLetterFrequency("", ret);
    deepEqual(ret, {}, "Empty string and empty alphabet failed.");
    ret = {'A': 0, 'B': 0, 'C': 0};
    countLetterFrequency("ABC", ret);
    deepEqual(ret, {'A': 1, 'B': 1, 'C': 1}, "ABC string and ABC alphabet failed.");
    ret =  {'A': 0, '̥': 0, 'R': 0};
    countLetterFrequency("È̪̪̲͉͍̫̥r̛̰̟̱̱̼̙i͏̢̳̩̭͖̩͙k̵͈̲͇̕ ͕̮̦͈̯͡R̩͖̤͉̩̳ö̝̰̖̯͇n̷̬̟̝̦̙̗̙̰͎͟m̟͓a̸̹̼̥̯̭͓͢r̶̢͏̰͈͔͍̞k͙̱̳̠̰̼̩̀", ret);
    deepEqual(ret, {'A': 1, '̥': 2, 'R': 3}, "Eriks git name string and ḀR alphabet failed.");
});

QUnit.test("test countLetterFrequency() with bad parameters", function() {
    raises(function(){
        countLetterFrequency(null, {});
    }, TypeError, "should throw typeError");
    raises(function(){
        countLetterFrequency(2, {});
    }, TypeError, "should throw typeError");
    raises(function(){
        countLetterFrequency(NaN, {});
    }, TypeError, "should throw typeError");
    raises(function(){
        countLetterFrequency(undefined, {});
    }, TypeError, "should throw typeError");

    raises(function(){
        countLetterFrequency("", null);
    }, TypeError, "should throw typeError");
    raises(function(){
        countLetterFrequency("", "");
    }, TypeError, "should throw typeError");
    raises(function(){
        countLetterFrequency("", NaN);
    }, TypeError, "should throw typeError");
    raises(function(){
        countLetterFrequency("", 3);
    }, TypeError, "should throw typeError");

});

QUnit.test("test getAlphabet with good parameters", function() {
    equal(getAlphabet("sv"), "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ", "Swedish" +
        " alphabet is incorrect");
    equal(getAlphabet("en"), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "English" +
        " alphabet is incorrect");

});

QUnit.test("test getAlphabet with bad parameters", function() {
    raises(function(){
        getAlphabet('de');
    }, Error, "should throw error");
    raises(function(){
        getAlphabet('sven');
    }, Error, "should throw error");
    raises(function(){
        getAlphabet(5);
    }, TypeError, "should throw type error");
    raises(function(){
        getAlphabet([]);
    }, TypeError, "should throw type error");
    raises(function(){
        getAlphabet([1,2,3,4,"hej",{}]);
    }, TypeError, "should throw type error");
    raises(function(){
        getAlphabet({test:"sv"});
    }, TypeError, "should throw type error");
    raises(function(){
        getAlphabet(NaN);
    }, TypeError, "should throw type error");
    raises(function(){
        getAlphabet(null);
    }, TypeError, "should throw type error");
    raises(function(){
        getAlphabet(undefined);
    }, TypeError, "should throw type error");

});