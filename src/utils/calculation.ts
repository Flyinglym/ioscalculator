export const calculation = (expression: string) => {
    // 去掉字符串中的空格
    expression = expression.replace(' ', '')

    // 用来匹配和分割字符串
    let a = expression.match(/((^\+)|(^\-))*((\d)+)|\+|\-|\*|\/|\(|\)/g)

    // 循环入栈
    while (a.length) {
        pushToStack(a)
    }

    // 最后如果只剩下3个内容，我们就直接计算结果。
    if (stack.length === 3) {
        // @ts-ignore
        return basicCompute(...stack)
    }
}

// 入栈
function pushToStack(a) {
    const s = a.shift()
    stack.push(s)

    // 每次入栈都尝试，末尾是否可计算
    compute(stack, s.length)
}

// 末尾可以pop出来计算 的情形
const canCompute = stack =>
    canHigh(stack) ||
    canLow(stack) ||
    canBrackets(stack) ||
    singleNumberInBrackets(stack)

// 判断可以计算的函数：括号表达式
const canBrackets = stack => {
    const len = stack.length
    return (
        stack.length >= 5 &&
        isRightBracket(stack[len - 1]) &&
        isNumber(stack[len - 2]) &&
        isFlag(stack[len - 3]) &&
        isNumber(stack[len - 4]) &&
        isLeftBracket(stack[len - 5])
    )
}

// 判断可以计算的函数：括号内只有单个数字
const singleNumberInBrackets = stack => {
    const len = stack.length
    return (
        stack.length >= 3 &&
        isRightBracket(stack[len - 1]) &&
        isNumber(stack[len - 2]) &&
        isLeftBracket(stack[len - 3])
    )
}

// 判断可以高阶数学运算的函数：乘除运算
const canHigh = stack => {
    const len = stack.length
    return (
        stack.length >= 3 &&
        isNumber(stack[len - 1]) &&
        isHighFlag(stack[len - 2]) &&
        isNumber(stack[len - 3])
    )
}

// 判断可以低阶阶数学运算的函数：加减运算
const canLow = stack => {
    const len = stack.length
    return (
        stack.length >= 4 &&
        isLowFlag(stack[len - 1]) &&
        isNumber(stack[len - 2]) &&
        isLowFlag(stack[len - 3]) &&
        isNumber(stack[len - 4])
    )
}

// 计算
var compute = stack => {
    // 括哈内单数字的入栈和出栈过程
    if (singleNumberInBrackets(stack)) {
        let rightFlag = stack.pop()
        let number = stack.pop()
        let leftBracket = stack.pop()
        stack.push(number)
    }

    // 括号内包含一个表达式的计算过程
    if (canBrackets(stack)) {
        let rightFlag = stack.pop()
        let right = stack.pop()
        let flag = stack.pop()
        let left = stack.pop()
        let leftBracket = stack.pop()
        const res = basicCompute(left, flag, right)
        stack.push(res)
    }

    // 可以进行乘除计算的过程
    if (canHigh(stack)) {
        let right = stack.pop()
        let flag = stack.pop()
        let left = stack.pop()
        const res = basicCompute(left, flag, right)
        stack.push(res)
    }

    // 可以进行加减计算的过程
    if (canLow(stack)) {
        let last = stack.pop()
        let right = stack.pop()
        let flag = stack.pop()
        let left = stack.pop()
        const bc = basicCompute(left, flag, right)
        stack.push(bc)

        stack.push(last)
    }

    //计算完后，再次判断末尾能不能触发连锁反应
    if (canCompute(stack)) {
        compute(stack)
    }
}


// 基本运算
const basicCompute = (a, b, c) => {
    if (b == '+') {
        return ~~a + ~~c
    } else if (b === '-') {
        return ~~a - ~~c
    } else if (b === '*') {
        return ~~a * ~~c
    } else {
        return ~~a / ~~c
    }
}

const isHighFlag = flag => /\*|\//.test(flag)
const isLowFlag = flag => /\+|\-/.test(flag)
const isFlag = flag => /\+|\-|\*|\//.test(flag)
const isNumber = num => /(\+|\-)*\d*/.test(num)

const isLeftBracket = flag => flag === '('
const isRightBracket = flag => flag === ')'
let stack = []