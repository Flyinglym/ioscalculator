export const calculateExpression = (expression: string): string => {
    let stack: number[] = [];
    let num: number = 0;
    let sign: string = '+';
    for (let i: number = 0; i < expression.length; i++) {
        if (!isNaN(parseFloat(expression[i]))) {
            num = num * 10 + parseFloat(expression[i]);
        }
        if (isNaN(parseFloat(expression[i])) && expression[i] !== ' ' || i === expression.length - 1) {
            if (sign === '+') {
                stack.push(num);
            } else if (sign === '-') {
                stack.push(-num);
            } else if (sign === '×') {
                stack.push(stack.pop() * num);
            } else if (sign === '÷') {
                stack.push(parseFloat(String(stack.pop() / num)));
            }
            sign = expression[i];
            num = 0;
        }
    }
    let result: number = 0;
    while (stack.length !== 0) {
        result += stack.pop();
    }
    return result.toString();
}

