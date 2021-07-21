# car-number-vue3

### ����
* car-number-vue3��һ�����vue3�ĳ��ƺ�����ؼ���֧���Զ��������

### ʾ��
[gitHub](https://windy-boy.github.io/vue-car-number-demo)

[gitee](http://chenjiancong.gitee.io/vue-car-number-demo)

### ��Ŀ��ʹ��
* ����

```
npm install car-number-vue3
```
* ��main.js�м���

```
import CarNumber from 'car-number-vue3'
import 'car-number-vue3/lib/carNumber.css'

createApp(App).use(CarNumber).mount('#app')
```
* ����Ҫ��ҳ����ʹ��

```
<CarNumber></CarNumber>
```

## API

### Props
����|����|Ĭ��ֵ|˵��
--|--|--|--
width|Number|200| �������
height|Number|30| �����߶�
borderColor|String|#959595| �����߿���ɫ
backgroundColor|String|transparent| ����򱳾���ɫ
borderRadius|Number|0| �߿�Բ��
fontColor|String|#959595| ������ɫ
fontSize|Number|16| ���ִ�С
defaultCarPlate|String|null| Ĭ�ϳ��ƺ�
maskBackground|String|transparent| ������ɫ
clickMaskCloseKeyBoard|Boolean|true| �Ƿ������ֹرռ���
isNewEnergy|Boolean|false| �Ƿ�����Դ����

### Events
����|����|˵��
--|--|--
@submit|--|�رռ���ʱ���������������ֵ

### Slots
����|slotProps|˵��
--|--|--
default|value:Array|�Զ��������

## ����
���κ�������鶼��ӭ�� issue

## License
[MIT](https://zh.wikipedia.org/wiki/MIT%E8%A8%B1%E5%8F%AF%E8%AD%89)

## �ر��л
[vue](https://github.com/vuejs/vue)

[input-number-plate](https://github.com/wokeT/input-number-plate)

## Change Log

* 1.0.2

fix bug

* 1.0.1

fix bug

* 1.0.0

�״η���
