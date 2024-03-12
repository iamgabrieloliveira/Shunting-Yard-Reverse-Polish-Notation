const MathSymbol = {
  Times: '.',
  Divide: '/',
  Plus: '+',
  Minus: '-',
  Power: '*',
}

const PrecedenceTable = {
  [MathSymbol.Plus]: 1,
  [MathSymbol.Minus]: 1,

  [MathSymbol.Times]: 2,
  [MathSymbol.Divide]: 2,

  [MathSymbol.Power]: 3,
}

type TOperationTable = {
  [key: number]: (a: number, b: number) => number,
}

const OperationTable: TOperationTable = {
  [MathSymbol.Plus]: (a: number, b: number) => a + b,
  [MathSymbol.Minus]: (a: number, b: number) => a - b,
  [MathSymbol.Times]: (a: number, b: number) => a * b,
  [MathSymbol.Divide]: (a: number, b: number) => a / b,
  [MathSymbol.Power]: (a: number, b: number) => a ** b,
}

const comparePrecedence = (a: string, b: string): 0 | 1 | -1 => {
  const ap = PrecedenceTable[a];
  const bp = PrecedenceTable[b];

  if (ap === undefined || bp === undefined) {
    return 1;
  }

  if (ap > bp) return 1;
  if (ap < bp) return -1;

  return 0;
}


const operators = Object.values(MathSymbol);

const isOperator = (x: string) => operators.includes(x);
const isNumber = (x: string | number) => x !== '' && !Number.isNaN(+x);

class ShuntingYard {
  protected pos: number = 0;

  protected outputStack: string[] = [];
  protected operatorsStack: string[] = [];

  constructor(protected expression: string) { }

  currentToken() {
    return this.expression.charAt(this.pos);
  }

  consume() {
    this.pos++;

    while (this.currentToken() === " ") {
      this.pos++;
    }
  }

  operatorsTop() {
    return this.operatorsStack[
      this.operatorsStack.length - 1
    ];
  }

  nextToken() {
    return this.expression.charAt(this.pos + 1);
  }

  run() {
    let token = this.currentToken();

    const skip = () => {
      this.consume();
      token = this.currentToken();
    }

    while (token) {

      if (isNumber(token)) {
        let fullNumber = token;
        let next: string;

        while (isNumber(next = this.nextToken())) {
          fullNumber += next;
          this.pos++;
        }

        this.outputStack.push(fullNumber.trim());

        skip();

        continue;
      }

      if (isOperator(token)) {
        let top = this.operatorsTop();

        while (top && comparePrecedence(token, top) === -1) {

          this.outputStack.push(
            this.operatorsStack.pop()!,
          );

          top = this.operatorsTop();
        }

        this.operatorsStack.push(token);

        skip();
        continue;
      }

      if (token === '(') {
        this.operatorsStack.push(token);

        skip();
        continue;
      }

      if (token === ')') {

        while (this.operatorsTop() !== '(') {

          if (this.operatorsTop() === undefined) {
            throw new Error('Parenteshis not found');
          }

          this.outputStack.push(
            this.operatorsStack.pop()!,
          );
        }

        // Discard left bracket
        this.operatorsStack.pop()!;
      }

      skip();
    }

    let operator: string;

    while (operator = this.operatorsStack.pop()!) {
      this.outputStack.push(operator);
    }

    return this.outputStack;
  }
}

class ReversePolishNotation {
  protected stack: (number | string)[] = [];

  constructor(protected tokens: string[]) { }

  run() {
    for (const token of this.tokens) {

      if (isNumber(token)) {
        this.stack.push(token);
        continue;
      }

      const op2 = Number(this.stack.pop());
      const op1 = Number(this.stack.pop());

      const result = this.performOperation(token, op1, op2);
      this.stack.push(result);
    }

    const result = this.stack.pop();

    if (result === undefined || !isNumber(result!)) {
      throw new Error('Error in RPN result ' + result)
    }

    return Number(result);
  }

  performOperation(op: string, op1: number, op2: number) {
    const opp = OperationTable[op];

    if (!opp) throw new Error(`Invalid operator: ${op}`);

    return opp(op1, op2);
  }
}


const assertEq = <T>(a: T, b: T) => {
  if (a !== b) {
    console.log(`[FAIL]: Failing asserting that ${a} is equal to ${b}`);
    return;
  }

  console.log('[PASS]: Test runs successfully');
}

const run = (expression: string): number => {
  const tokens = new ShuntingYard(expression).run();
  const result = new ReversePolishNotation(tokens).run();

  return result;
}

// [TESTS]

assertEq(run('1 + 1'), 2);
assertEq(run('5 + 5 . 2'), 15);
assertEq(run('(5 + 5) . 2'), 20);
assertEq(run('3 + 4 . 2 / ( 1 - 5 ) * 2 * 3'), 3.0001220703125);
