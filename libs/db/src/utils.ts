import { ValueTransformer } from 'typeorm';

// TODO: 이게 없어도 bool - bit transform이 잘 작동하는 것 같은데.. 확인 필요
export class BoolBitTransformer implements ValueTransformer {
  // To db from typeorm
  to(value: boolean | null): Buffer | null {
    if (value === null) {
      return null;
    }

    const res = Buffer.alloc(1);
    res[0] = value ? 1 : 0;
    return res;
  }
  // From db to typeorm
  from(value: any): boolean | null {
    if (value === null) {
      return null;
    }

    return value[0] === 1;
  }
}

export class BoolStringTransformer implements ValueTransformer {
  // To db from typeorm
  to(value: boolean | null): string | null {
    if (value === null) {
      return null;
    }
    return value ? 'Y': 'N';
  }
  // From db to typeorm
  from(value: any): boolean | null {
    if (value === null) {
      return null;
    }

    return value.toLowerCase() == 'y';
  }
}
