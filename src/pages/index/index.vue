<template>
  <view class="box">
    <view class="result">
      <!--   结果展示   -->
      <view ref="resultRef">{{ num }}</view>
    </view>
    <view class="keyboard">
      <view class="right">
        <!--    数据变化    -->
        <view class="right-top numbers"
              v-for="changeItem in changeConfig"
              :key="changeItem"
              @click="changeConfigEvent(changeItem)">{{ changeItem }}
        </view>
        <view class="right-bottom" v-for="numItem in numConfig" :key="numItem" @click="numConfigEvent(numItem)">
          <!--    选择数字    -->
          <view class="numbers" :class="numItem!=='0'?'':'zero'">{{ numItem }}</view>
        </view>
      </view>
      <view class="left">
        <!--    选择计算方法    -->
        <view class="operate numbers "
              :class="operateItem.styleActive?'active':''"
              v-for="(operateItem,index) in operateConfig"
              :key="operateItem"
              @click="operateConfigEvent(operateItem,index)"
        >
          {{ operateItem.change }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {calculateExpression} from "../../utils/calculation";

interface operateType {
  change: string
  styleActive: boolean
}

let changeConfig = reactive(['AC', '±', '%'])
let numConfig = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.']
let operateConfig = reactive<operateType[]>([
  {change: '÷', styleActive: false},
  {change: '×', styleActive: false},
  {change: '-', styleActive: false},
  {change: '+', styleActive: false},
  {change: '=', styleActive: false}
])
// 数学表达式
let expression: string[] = ['0']

// 初始结果
let num = ref<string>('0')

// 清除/切换正负/百分比
let changeConfigEvent = (e) => {
  if (e === 'C' || e === 'AC') {
    expression = ['0']
    num.value = '0'
    operateConfig.forEach(item => {
      item.styleActive = false
    })
  }
}

// 选择数字
let numConfigEvent = (e) => {
  operateConfig.forEach(item => {
    item.styleActive = false
  })
  let lastPerson = expression[expression.length - 1]
  if (isNaN(parseFloat(lastPerson))) {
    expression.push(e)
    num.value = e
    return
  }
  if (expression.length > 3) {
    expression.splice(2, 1, num.value)
  }
  expression[lastPerson] === '0' ? num.value = e : num.value += e
  expression.splice(expression.length - 1, 1, num.value)
}

// 选择计算方式/计算结果
let operateConfigEvent = (e, i) => {
  operateConfig.forEach(item => {
    item.styleActive = false
  })
  if (e.change === '=') {
    console.log(expression.join(''))
    num.value = calculateExpression(expression.join(''))
    expression.splice(0, 1, calculateExpression(expression.join('')))
    return
  }
  e.styleActive = true

  if (expression[0] == expression[2]) {
    expression.splice(1, 1, e.change)
    return;
  }
  // 当第二次选择运算符号的时候计算出结果
  if (expression.length >= 2) {
    num.value = calculateExpression(expression.join(''))
    expression = [calculateExpression(expression.join('')), e.change, calculateExpression(expression.join(''))]
    // expression.splice(0, 1, calculateExpression(expression.join('')))
    // expression.splice(1, 1, e.change)
    return;
  }
  expression.push(e.change)
}


// 监听结果
watch(num, (newNum) => {
  let newCount = newNum.toString().replace(/[.,]/g, '')
  if (newCount.length > 9) {
    let aa = parseFloat(num.value.toString())
    num.value = newNum % 1 != 0 ? aa.toExponential(4) : aa.toExponential(0)
  }
  if (newNum == 0) {
    changeConfig[0] = "AC"
  } else {
    changeConfig[0] = "C"
  }
})
</script>

<style scoped lang="scss">
.box {
  background-color: black;
  position: fixed;
  bottom: 0;

  .result {
    width: 100%;
    height: 630rpx;
    background-color: black;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;

    view {
      color: white;
      font-size: 120rpx;
    }
  }

  .keyboard {
    display: flex;

    .right {
      display: flex;
      flex-wrap: wrap;

      &-top {
        background-color: #5e5e5e;
      }
    }

    .left {
      display: flex;
      flex-direction: column;

      .operate {
        background-color: #c07914;
      }
    }
  }
}

.numbers {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background-color: #3d3d3d;
  text-align: center;
  line-height: 150rpx;
  font-size: 36px;
  font-weight: bold;
  color: white;
  margin: 9px;
}

.zero {
  width: 340rpx;
  border-radius: 75rpx;
}

.active {
  color: #c07914;
  background-color: #ffffff !important;
}
</style>
