This is a repository where I'm going to leave my implementations of the algorithms below. It's a relatively simple algorithm, but it's really nice to do, so I plan to do it in several different languages.

### Languages

- [X] Typescript
- [ ] PHP
- [ ] Rust
- [ ] OCaml
- [ ] ?

This [Shunting Yard](https://en.wikipedia.org/wiki/Shunting_yard_algorithm) algorithm is used to evaluate a mathematical expression with the correct order of operations:

Example:

```js
const expression = '3 + 4 × 2 ÷ ( 1 − 5 ) ^ 2 ^ 3'

const result = ?
```
How would you do this without using the `eval()` function? The **Shunting Yard** is the answer to that question!

### How that algorithm work?

This [pseudo code example](https://en.wikipedia.org/wiki/Shunting_yard_algorithm#The_algorithm_in_detail) in Wikipedia explains it perfectly and I think you can understand it very well.

What you have to know
is that this algorithm did not evaluate the expression alone, just generate one expression to be parsed by other algorithm.

```js
const expression = '3 + 4 × 2 ÷ ( 1 − 5 ) ^ 2 ^ 3'

shuntingYard(expression); // 3 4 2 × 1 5 − 2 3 ^ ^ ÷ +
```
### Next step

Yep, now you have to implement the [Reverse Polish Notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation) that is also described in the Wikipedia very well:

```js
const expression = '3 + 4 × 2 ÷ ( 1 − 5 ) ^ 2 ^ 3'

const result = shuntingYard(expression); // 3 4 2 × 1 5 − 2 3 ^ ^ ÷ +

reversePolishNotation(result); // 3.00012207031 (the right value, trust me...)
```
