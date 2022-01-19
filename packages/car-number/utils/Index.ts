import { Ref, onBeforeUnmount } from 'vue';
import { Observable } from "rxjs";

export const provinceList = [
  '京',
  '津',
  '渝',
  '沪',
  '冀',
  '晋',
  '辽',
  '吉',
  '黑',
  '苏',
  '浙',
  '皖',
  '闽',
  '赣',
  '鲁',
  '豫',
  '鄂',
  '湘',
  '粤',
  '琼',
  '川',
  '贵',
  '云',
  '陕',
  '甘',
  '青',
  '蒙',
  '桂',
  '宁',
  '新',
  '藏',
  '使',
  '领',
  '警',
  '学',
  '港',
  '澳'
];

export const letterList = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

interface RxKeyDownProps {
  visible: Ref<boolean>;
  onKeyDown: (code: string) => void;
}

/**
 * 监听键盘
 * @param code 
 * @returns 
 */
export function useRxKeyDown(props: RxKeyDownProps) {
  const sub = Observable.fromEvent<KeyboardEvent>(document, "keydown")
    .filter(() => props.visible.value)
    .filter(e => {
      if (e.code === 'Backspace') return true;
      if (/^Key[A-Z]$/.test(e.code)) return true;
      if (/^Digit[0-9]$/.test(e.code)) return true;
      return false;
    })
    .do(e => {
      e.preventDefault();
      e.stopPropagation();
    })
    .map(e => e.code)
    .subscribe((code) => {
      if (code === 'Backspace') {
        props.onKeyDown(code);
        return;
      }
      if (/^Key[A-Z]$/.test(code)) {
        props.onKeyDown(code[3]);
        return;
      }
      if (/^Digit[0-9]$/.test(code)) {
        props.onKeyDown(code[5]);
        return;
      }
      console.log(code);
    });

  onBeforeUnmount(() => {
    sub.unsubscribe();
  });
}
