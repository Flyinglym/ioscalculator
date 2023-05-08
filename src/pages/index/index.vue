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
          <view class="numbers" :class="numItem?'':'zero'">{{ numItem }}</view>
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

interface operateType {
  change: string
  active: boolean
  styleActive: boolean
}

let changeConfig = reactive(['AC', '±', '%'])
let numConfig = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.']
let operateConfig = reactive<Array<operateType>>([
  {change: '÷', active: false, styleActive: false},
  {change: '×', active: false, styleActive: false},
  {change: '-', active: false, styleActive: false},
  {change: '+', active: false, styleActive: false},
  {change: '=', active: false, styleActive: false}
])

// 初始结果
let num = ref<number | string>(0)
// 第一次输入
let first: number | string = 0
// 第二次输入
let second: number | string = 0
// 是否正在等待计算
let wait = ref(false)

// 清除/切换正负/百分比
let changeConfigEvent = (e) => {
  if (e === 'AC' || e === 'C') {
    wait.value = false;
    num.value = first = second = 0
    operateConfig.forEach(item => {
      item.styleActive = item.active = false
    })
    return
  }
  switch (e) {
    case "±":
      if (wait.value) {
        num.value = second = '-0'
        return
      }
      // if (!num.value.toString().includes('-')) {
      //   num.value = "-" + num.value
      // } else {
      //   num.value = num.value.toString().split('-')[1]
      // }
      // first = num.value
      first = num.value = !num.value.toString().includes('-') ?
          "-" + num.value
          :
          num.value.toString().split('-')[1]
      break;
    case "%":
      num.value = num.value / 100;
      break;
  }
}

// 选择数字
let numConfigEvent = (e) => {
  // 清除计算方式的选中效果
  operateConfig.forEach(item => {
    item.styleActive = false
  })
  if (wait.value) {
    num.value = second
    if (num.value.toString().split(/[.,]/g)[0].length >= 9) return
    second = num.value == 0 ?
        num.value = num.value.toString().includes('-') ? '-' + e : e
        :
        num.value += e.toString()
  } else {
    if (num.value.toString().split(/[.,]/g)[0].length >= 9) return
    first = num.value == 0 ?
        num.value = num.value.toString().includes('-') ? '-' + e : e
        :
        num.value += e.toString()
  }
}

// 选择计算方式/计算结果
let operateConfigEvent = (e, i) => {
  operateConfig.forEach(item => {
    item.styleActive = item.active = false
  })
  operateConfig[i].styleActive = operateConfig[i].active = true
  if (operateConfig[i].change === '=') {
    operateConfig[i].styleActive = false
  }
  // if (e.change === '=') {
  if (!wait.value) return num.value
  let activeSymbol = operateConfig.find(item => item.active === true)
  console.log(activeSymbol)
  let numFirst = parseFloat(first.toString())
  let numSecond = parseFloat(second.toString())
  num.value = calculationResults(numFirst, numSecond, activeSymbol.change)
  operateConfig.forEach(item => {
    item.styleActive = false
  })
  first = num.value
  return
  // }


}


/*
* firstNum: 第一次输入；
* secondNum： 第二次输入；
* conditions： 计算方法；
* */
let calculationResults = (firstNum, secondNum, conditions) => {
  switch (conditions) {
    case '+':
      return firstNum + secondNum
      break;
    case '-':
      return firstNum - secondNum
      break;
    case '×':
      return firstNum * secondNum
      break;
    case '÷':
      return firstNum / secondNum
      break;
  }
}

// 监听结果
watch(num, (newNum) => {
  let newCount = newNum.toString().replace(/[.,]/g, '')
  if (newCount.length > 9) {
    let aa = parseFloat(num.value.toString())
    num.value = newNum % 1 != 0 ? aa.toExponential(4) : aa.toExponential(0)
    /*  if (newNum % 1 != 0) {
        console.log(1111)
        num.value = aa.toExponential(4)
      } else {
        console.log(2222)
        num.value = aa.toExponential(0)
      }*/
  }
  if (newNum == 0) {
    changeConfig[0] = "AC"
  } else {
    changeConfig[0] = "C"
  }
})
watch(operateConfig, (newOperate: Array<operateType>) => {
  newOperate.map(item => {
    if (item.styleActive === true) {
      second = 0
      wait.value = true
    }
  })
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
