<template>
  <el-popover v-model:visible="visible"
              :width="600"
              @show="onShow"
              :show-arrow="false"
              popper-class="my-popper"
              trigger="click">
    <template #reference>
      <slot name="reference">
        <el-button>选择车牌</el-button>
      </slot>
    </template>
    <template #default>
      <div style="height: 250px; width: 100%;position:relative;">
        <div class="car__number__container">
          <div class="mask__container"
               :style="{backgroundColor: maskBackground}"></div>
          <!-- 输入框 -->
          <div class="input-row"
               style=" position:absolute;top:4px;left:200px; z-index:999999999;">
            <slot :value="inputValue">
              <div class="input__container"
                   :style="{border: `1px solid ${borderColor}`, borderRadius: borderRadius + 'px', width: width + 'px', height: height + 'px', backgroundColor: backgroundColor}">
                <div class="input__box"
                     v-for="item in carNumberLength"
                     :key="item"
                     :style="{fontSize: fontSize + 'px', color: fontColor}">
                  <div class="line"
                       v-if="item != carNumberLength"
                       :style="{backgroundColor: borderColor}"></div>
                  {{ inputValue[item - 1] }}
                </div>
              </div>
            </slot>
          </div>
          <!-- 键盘 -->
          <transition name="keyboard">
            <div class="keyboard__container">
              <header class="keybord__header">
                <el-button size="mini"
                           class="mini-btn"
                           @click.stop="inputValue = []">清空</el-button>
                <el-button size="mini"
                           type="primary"
                           class="mini-btn"
                           :disabled="inputValue.length < carNumberLength"
                           @click.stop="submit()">确定</el-button>
              </header>
              <div class="keyboard__body">
                <ul class="keyboard__body__province__list"
                    v-if="keybordType === 'ABC'">
                  <li @click.stop="inputWord(item)"
                      class="button"
                      v-for="item in provinceList.slice(0, 30)"
                      :key="item">
                    {{ item }}
                  </li>
                </ul>
                <div v-else>
                  <ul class="keyboard__body__letter__list">
                    <li @click.stop="inputWord(item)"
                        class="button"
                        v-for="item in letterList.slice(0, 10)"
                        :key="item">
                      {{ item }}
                    </li>
                  </ul>
                  <ul class="keyboard__body__letter__list">
                    <li @click.stop="inputWord(item)"
                        class="button"
                        v-for="item in letterList.slice(10, 20)"
                        :key="item">
                      {{ item }}
                    </li>
                  </ul>
                  <ul class="keyboard__body__letter__list__surplus">
                    <li @click.stop="inputWord(item)"
                        class="button"
                        v-for="item in letterList.slice(20, 29)"
                        :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="keyboard__body__bottom">
                  <div @click.stop="toggle()"
                       class="other__button">
                    {{ keybordType }}
                  </div>
                  <ul class="keyboard__body__bottom__item__list"
                      :style="{columnCount: keybordType === 'ABC' ? 7 : 5}">
                    <li @click.stop="inputWord(item)"
                        class="button"
                        v-for="item in surplusList"
                        :key="item">
                      {{ item }}
                    </li>
                  </ul>
                  <div @click.stop="inputValue.pop()"
                       class="other__button">
                    <i class="iconfont-cjc icon-cjc-delete delete__btn"></i>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, computed, onBeforeUnmount } from 'vue';
  import CarNoKeyboard from './Index.vue';
  import * as MyUtils from './utils/Index';
  import { Observable } from "rxjs";

  export default defineComponent({
    components: {
      CarNoKeyboard,
    },
    name: 'CarNumberPopover',
    props: {
      modelValue: {
        type: String,
      },
      // 输入框宽度
      width: {
        type: Number,
        default: 200
      },
      height: {
        type: Number,
        default: 30
      },
      // 输入框边框颜色
      borderColor: {
        type: String,
        default: '#959595'
      },
      // 输入框背景颜色
      backgroundColor: {
        type: String,
        default: 'transparent'
      },
      // 边框圆角
      borderRadius: {
        type: Number,
        default: 0
      },
      // 文字颜色
      fontColor: {
        type: String,
        default: '#959595'
      },
      // 文字大小
      fontSize: {
        type: Number,
        default: 16
      },
      // 默认车牌号
      defaultCarPlate: {
        type: String
      },
      // 遮罩颜色
      maskBackground: {
        type: String,
        default: 'transparent'
      },
      // 是否点击遮罩关闭键盘
      clickMaskCloseKeyBoard: {
        type: Boolean,
        default: true
      },
      // 是否新能源车牌
      isNewEnergy: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue'],
    setup(props, context) {
      const visible = ref(false);

      const inputValue = ref<string[]>([]);
      // const carNumberLength = ref(7);
      const keybordType = ref('ABC');
      const provinceList = ref(MyUtils.provinceList);
      const letterList = ref(MyUtils.letterList);

      const carNumberLength = computed(() => props.isNewEnergy ? 8 : 7);

      const surplusList = computed(() => {
        if (keybordType.value === 'ABC') {
          return provinceList.value.slice(29, 36)
        } else {
          return letterList.value.slice(29, 34)
        }
      });

      watch(inputValue, () => {
        let len = carNumberLength.value;
        if (inputValue.value.length === 0) {
          keybordType.value = 'ABC'
        }
        if (inputValue.value.length > 0 && inputValue.value.length < len) {
          keybordType.value = '返回'
        }
      }, {
        immediate: true,
        deep: true
      });

      const SetVal = (str: string = '') => {
        inputValue.value = [];
        const len = Math.min(str.length, carNumberLength.value);
        for (let i = 0; i < len; i++) {
          inputValue.value.push(str[i]);
        }
      }

      const onShow = () => {
        if (props.modelValue) {
          SetVal(props.modelValue);
        } else if (props.defaultCarPlate) {
          SetVal(props.defaultCarPlate);
        }
        else {
          SetVal();
        }
      };

      // 监听键盘输入
      MyUtils.useRxKeyDown({
        visible: visible,
        onKeyDown: code => {
          if (code === 'Backspace') {
            inputValue.value.pop();
          }
          else if (inputValue.value.length < carNumberLength.value) {
            inputValue.value.push(code);
          }
        },
      });

      return {
        visible,
        inputValue,
        carNumberLength,
        keybordType,
        surplusList,
        provinceList,
        letterList,
        onShow,

        // 完成输入
        submit() {
          visible.value = false;
          context.emit('update:modelValue', inputValue.value.join(''));
        },
        // 键盘类型切换
        toggle() {
          let len = props.isNewEnergy ? 7 : 6;
          if (inputValue.value.length > 0 && inputValue.value.length < len) return
          keybordType.value = keybordType.value === 'ABC' ? '返回' : 'ABC'
        },
        // 输入
        inputWord(val: string) {
          if (inputValue.value.length === carNumberLength.value) return;
          inputValue.value.push(val);
        },
      };
    },
  });
</script>

<style scoped>
  .mini-btn {
    margin-top: 8px;
    width: 60px;
    height: 10px;
  }
  .car__number__container {
    user-select: none;
  }
  .car__number__container .keyboard-enter-active,
  .car__number__container .keyboard-leave-active {
    transition: all 0.2s linear;
    transform: translateY(0px);
  }
  .car__number__container .keyboard-enter,
  .car__number__container .keyboard-leave-to {
    transform: translateY(250px);
  }
  .car__number__container .mask__container {
    width: 100vw;
    overflow-y: scroll;
    height: calc(350vh);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
  }
  .car__number__container .input__container {
    position: relative;
    z-index: 99;
    display: flex;
  }
  .car__number__container .input__container .input__box {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .car__number__container .input__container .line {
    width: 1px;
    position: absolute;
    transform: translate(0, -50%);
    top: 50%;
    right: 0;
    height: 50%;
  }
  .car__number__container .keyboard__container {
    /* position: fixed; */
    position: absolute;
    z-index: 999;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 250px;
    background: #d0d3dc;
    /* box-shadow: 0 6px 10px 3px #959595; */
    box-shadow: none;
  }
  .car__number__container .keyboard__container .keybord__header {
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    background: #f0f0f0;
  }
  .car__number__container .keyboard__container .keyboard__body {
    padding: 5px 5px 15px 5px;
    box-sizing: border-box;
  }
  .car__number__container .keyboard__container .keyboard__body__province__list {
    list-style: none;
    padding: 0;
    margin: 0;
    column-count: 10;
    column-gap: 5px;
  }
  .car__number__container .keyboard__container .keyboard__body__letter__list {
    list-style: none;
    padding: 0;
    margin: 0;
    column-count: 10;
    column-gap: 5px;
  }
  .car__number__container
    .keyboard__container
    .keyboard__body__letter__list__surplus {
    list-style: none;
    padding: 0;
    margin: 0;
    column-count: 9;
    column-gap: 5px;
    padding: 0 13px;
  }
  .car__number__container .keyboard__container .keyboard__body__bottom {
    display: flex;
    justify-content: space-between;
  }
  .car__number__container
    .keyboard__container
    .keyboard__body__bottom__item__list {
    width: 100%;
    margin: 0;
    padding: 0 5px;
    list-style: none;
    column-count: 7;
    column-gap: 5px;
  }
  .car__number__container .button {
    text-align: center;
    line-height: 40px;
    height: 40px;
    border-radius: 5px;
    background: white;
    color: black;
    margin-bottom: 7px;
  }
  .car__number__container .button:active {
    background: #f0eded;
  }
  .car__number__container .other__button {
    width: 15vw;
    height: 40px;
    background: #a8b0bd;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color: #000;
  }
  .car__number__container .other__button:active {
    background: white;
  }
  .car__number__container .other__button .delete__btn {
    font-size: 24px;
    color: #000;
  }
</style>
