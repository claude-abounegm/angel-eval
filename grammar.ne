@builtin "number.ne"
@builtin "string.ne"
@builtin "postprocessors.ne"

@{%
const Variable = require('./Variable');
const Conditional = require('./Conditional');
const Negation = require('./Negation');

const arrayify = item => Array.isArray(item) ? item : [item];
const joinFirst =
  (seperator = "") =>
  ([items]) =>
    items.join(seperator);

const joinAll =
  (seperator = "") =>
  (items) =>
    items.join(seperator);

const toConditional = (items) => new Conditional(items[0], items[4], items[2]);
%}

main -> expression {% id %}

expression -> booleanExpression {% id %}

booleanExpression -> 
        equalityExpression {% id %}
        | equalityExpression _ booleanOperator _ booleanExpression {% toConditional %}
booleanOperator -> "&&" {% id %} | "||" {% id %}

equalityExpression -> 
        relationalExpression {% id %}
        | relationalExpression _ equalityOperator _ equalityExpression {% toConditional %}
equalityOperator -> "===" {% id %} | "!==" {% id %}
                # | "==" {% id %} | "!=" {% id %}

relationalExpression ->
        unaryExpression {% id %}
        | unaryExpression _ relationalOperator _ relationalExpression {% toConditional %}
relationalOperator -> ">=" {% id %} | ">" {% id %} | "<" {% id %} | "<=" {% id %}

unaryExpression ->
        variablePath {% ([node]) => Variable.parse(node)  %}
        | floatLiteral {% id %}
        | intLiteral {% id %}
        | stringLiteral {% id %}
        | "!" _ expression {% d => new Negation(d[2]) %}
        | "(" _ expression _ ")" {% d => d[2] %}

variablePath ->
        variable {% id %}
        | variablePath _ "." _ variableAfterDot {% d => [...arrayify(d[0]), d[4]] %}
        | variablePath "[" _ expression _ "]" {% d => [...arrayify(d[0]), d[3]] %}

variable -> variableFirstLetter variableAfterDot {% joinAll() %}
variableFirstLetter -> [a-zA-Z_] {% id %}
variableAfterDot -> [a-zA-Z0-9_]:* {% joinFirst() %}

floatLiteral -> decimal {% id %}
intLiteral -> int {% id %}
stringLiteral ->
        dqstring {% id %}
        | sqstring {% id %}
        # | backTickStringLiteral {% id %}

# backTickStringLiteral -> "`" pieces "`" {% d => d[1] %}

# variable ->
#        "${" _ expression _ "}" {% d => d[2] %}

_ -> [\s]:* {% () => null %}

# stringLiteral -> "\"" (([^\n\\"] | "\\" ["\\ntbfr]):* {% joinFirst() %}) "\"" {% d => d[1] %}
#                 | "'" (([^\n\\'] | "\\" ['\\ntbfr]):* {% joinFirst() %}) "'" {% d => d[1] %}