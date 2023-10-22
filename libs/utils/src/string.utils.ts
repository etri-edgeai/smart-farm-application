export class StringUtils {
  static isNumeric(n) {
    return n != '' && !isNaN(+n);
  }
  static toNumber(n) {
    return this.isNumeric(n) ? +n : null;
  }

  static capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  }

  static spreadKorean(keyword: string) {
    // 초성(19자) ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ
    const initialSound: number[] = [
      0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143, 0x3145, 0x3146, 0x3147, 0x3148, 0x3149, 0x314a,
      0x314b, 0x314c, 0x314d, 0x314e,
    ];

    // 중성(21자) ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
    const middleSound: number[] = [
      0x314f, 0x3150, 0x3151, 0x3152, 0x3153, 0x3154, 0x3155, 0x3156, 0x3157, 0x3158, 0x3159, 0x315a, 0x315b, 0x315c, 0x315d,
      0x315e, 0x315f, 0x3160, 0x3161, 0x3162, 0x3163,
    ];

    // 종성(28자) <없음> ㄱ ㄲ ㄳ ㄴ ㄵ ㄶ ㄷ ㄹ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅁ ㅂ ㅄ ㅅ ㅆ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ
    const lastSound: number[] = [
      0x0000, 0x3131, 0x3132, 0x3133, 0x3134, 0x3135, 0x3136, 0x3137, 0x3139, 0x313a, 0x313b, 0x313c, 0x313d, 0x313e, 0x313f,
      0x3140, 0x3141, 0x3142, 0x3144, 0x3145, 0x3146, 0x3147, 0x3148, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e,
    ];

    const chars: number[] = [];
    const elements: string[] = [];

    for (let i = 0; i < keyword.length; i = i + 1) {
      // 해당 문자를 코드로 변환
      chars[i] = keyword.charCodeAt(i);
      // "AC00:가" ~ "D7A3:힣" 에 속한 글자면 분해
      if (chars[i] >= 0xac00 && chars[i] <= 0xd7a3) {
        let initialPartial: number;
        let middlePartial: number;
        let lastPartial: number;

        // 해당 문자가 몇번째 한글 인지 계산
        const charOrder = chars[i] - 0xac00;
        // 중성 종성의 조합 총개수로 나누게되면 초성이 무엇인지 배열상의 인덱스를 구해줄 수 있음.
        // 예: 강, 낭 이 두개의 글자를 비교할 때 예를 들어 강이 10번째 글자라고 한다면, 낭은 ㅏㅇ, ㅏㄴ, ㅏㄷ... 등
        // 조합의 갯수만큼 있은 후 그다음이 됨. 그다음에서 그다다음까지는 ㄴ이 됨.
        initialPartial = charOrder / (21 * 28);

        // 중성 종성의 조합의 총개수로 나눈후 추가적으로 남은 것 두개가 중성과 종성이됨.
        const remainPartial = charOrder % (21 * 28);
        // 위에서 나온 것을 중 동일한 방법을 통해 종성에 올수있는 갯수 만큼을 나눠 중성의 배열상의 인덱스를 구해줌
        middlePartial = remainPartial / 28;
        // 중성까지 계산한 후 나머지 값이 종성의 배열상의 인덱스가 됨.
        lastPartial = remainPartial % 28;

        // 초성의 위의 경우에서 추가적으로 나올케이스 없음. 바로 추가.
        elements.push(String.fromCharCode(initialSound[Math.floor(initialPartial)]));

        // 복모음 분리
        switch (Math.floor(middlePartial)) {
          case 9:
            elements.push('ㅗㅏ');
            break;
          case 10:
            elements.push('ㅗㅐ');
            break;
          case 11:
            elements.push('ㅗㅣ');
            break;
          case 14:
            elements.push('ㅜㅓ');
            break;
          case 15:
            elements.push('ㅜㅔ');
            break;
          case 16:
            elements.push('ㅜㅣ');
            break;
          case 19:
            elements.push('ㅡㅣ');
            break;
          default:
            // 복모음이 아닐 경우 추가
            elements.push(String.fromCharCode(middleSound[Math.floor(middlePartial)]));
        }

        // 종성이 0이 아니면, 즉 받침이 있으면
        if (lastPartial !== 0x0000) {
          // 복자음 분리
          switch (Math.floor(lastPartial)) {
            case 3:
              elements.push('ㄱㅅ');
              break;
            case 5:
              elements.push('ㄴㅈ');
              break;
            case 6:
              elements.push('ㄴㅎ');
              break;
            case 9:
              elements.push('ㄹㄱ');
              break;
            case 10:
              elements.push('ㄹㅁ');
              break;
            case 11:
              elements.push('ㄹㅂ');
              break;
            case 12:
              elements.push('ㄹㅅ');
              break;
            case 13:
              elements.push('ㄹㅌ');
              break;
            case 14:
              elements.push('ㄹㅍ');
              break;
            case 15:
              elements.push('ㄹㅎ');
              break;
            case 18:
              elements.push('ㅂㅅ');
              break;
            default:
              // 복자음이 아닐 경우 추가
              elements.push(String.fromCharCode(lastSound[Math.floor(lastPartial)]));
          }
        }
      } else {
        elements.push(String.fromCharCode(chars[i]));
      }
    }

    return elements.join('');
  };

  static setPhoneFormat = (numb: string, isSecure?: string): string => {
    if(!numb) return '-';

    let formatNum = '';

    if(numb.length == 11){
      isSecure === 'secure' ?
        formatNum = numb.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3') :
        formatNum = numb.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

    }else if(numb.length == 8){
      formatNum = numb.replace(/(\d{4})(\d{4})/, '$1-$2');

    }else{
      if(numb.indexOf('02') == 0){
        isSecure === 'secure' ?
          formatNum = numb.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3') :
          formatNum = numb.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');

      }else{
        isSecure === 'secure' ?
          formatNum = numb.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3') :
          formatNum = numb.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

      }
    }

    return formatNum ? formatNum : "-";
  }
}
