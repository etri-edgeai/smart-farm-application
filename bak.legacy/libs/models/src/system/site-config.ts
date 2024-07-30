export class SiteConfig {
  code: string; // 사이트코드, ex) by
  lang: string = 'ko'; // language, ex) ko
  latitude?: number; // 위도
  longitude?: number; // 경도
  titleMon?: string;
  titleAdmin?: string;
  titleApp?: string;
  theme: string = 'default';
  schemeDark = 0; // false. default light
  allowedIps?: string; // comma seperated string
  clientIp?: string; // http request인 경우 client의 ip (=headers.realIp)
}
