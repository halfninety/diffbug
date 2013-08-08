/*jslint nomen: true */
var helper = require('../helper'),
    code,
    verifier;

module.exports = {
    "with a function expression that uses strict": {
        setUp: function (cb) {
            code = [
                '(function () {',
                '    "use strict";',
                '    var x = Object.freeze({ foo: 1 });',
                '    try {',
                '        x.foo = 2;',
                '        output = "fail";',
                '    } catch (ex) {',
                '        output = "pass";',
                '    }',
                '}());'
            ];
            verifier = helper.verifier(__filename, code);
            cb();
        },

        "should trace one statement less": function (test) {
            verifier.verify(test, [], "pass", {
                statements: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 0, 6: 1 },
                branches: {},
                functions: { 1: 1}
            });
            test.done();
        }
    },
    "with a function declaration that uses strict": {
        setUp: function (cb) {
            code = [
                'function foo() {',
                '    "use strict";',
                '    var x = Object.freeze({ foo: 1 });',
                '    try {',
                '        x.foo = 2;',
                '        output = "fail";',
                '    } catch (ex) {',
                '        output = "pass";',
                '    }',
                '}',
                'foo();'
            ];
            verifier = helper.verifier(__filename, code);
            cb();
        },

        "should trace one statement less": function (test) {
            verifier.verify(test, [], "pass", {
                statements: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 0, 6: 1, 7: 1 },
                branches: {},
                functions: { 1: 1}
            });
            test.done();
        }
    },
    "with a function declaration that looks like strict but is not": {
        setUp: function (cb) {
            code = [
                'function foo() {',
                '    1;',
                '    "use strict";',
                '    var x = Object.freeze({ foo: 1 });',
                '    try {',
                '        x.foo = 2;',
                '        output = "fail";',
                '    } catch (ex) {',
                '        output = "pass";',
                '    }',
                '}',
                'foo();'
            ];
            verifier = helper.verifier(__filename, code);
            cb();
        },

        "should trace all statements as usual": function (test) {
            verifier.verify(test, [], "fail", {
                statements: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 0, 9: 1 },
                branches: {},
                functions: { 1: 1}
            });
            test.done();
        }
    },
    "with a file-level strict declaration": {
        setUp: function (cb) {
            code = [
                '    "use strict";',
                '    var x = Object.freeze({ foo: 1 });',
                '    try {',
                '        x.foo = 2;',
                '        output = "fail";',
                '    } catch (ex) {',
                '        output = "pass";',
                '    }'
            ];
            verifier = helper.verifier(__filename, code);
            cb();
        },

        "should not change behavor (this is a bug!)": function (test) {
            verifier.verify(test, [], "fail", {
                statements: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 0 },
                branches: {},
                functions: {}
            });
            test.done();
        }
    }
};

