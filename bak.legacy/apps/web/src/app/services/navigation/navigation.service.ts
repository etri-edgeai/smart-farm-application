import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from './navigation.types';
import { FuseNavigationItem } from '@front/components/navigation';
import { cloneDeep } from 'lodash-es';
import { TranslocoService } from '@ngneat/transloco';
import { Role } from '@libs/models';
import { UserService } from '@front/services';
import { FrontConfigService } from '@front/services/config';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

  constructor(private _httpClient: HttpClient, private _userService: UserService, private _translocoService: TranslocoService, private config: FrontConfigService) {
    this._navigation.next({ compact: [], default: [], futuristic: [], horizontal: [] });
    // 언어가 바뀌면 메뉴를 다시 번역한다
    // this._translocoService.langChanges$.subscribe(() => this.get());
    this._translocoService.events$.subscribe((event) => {
      if (event.type == 'langChanged') {
        // langChanged 이벤트가 발생할 때 json 파일이 아직 로딩되기 전이면 번역이 안되기 때문에, 있을 때만 번역을 시킨다.
        // 없는 경우는 translationLoadSuccess 이벤트가 일어나기 때문에 거기서 처리
        const activeLang = this._translocoService.getActiveLang();
        if (this._translocoService.getTranslation(activeLang)) {
          this.get();
        }
      } else if (event.type == 'translationLoadSuccess') {
        this.get();
      }
    });
  }
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

  get(): Observable<Navigation> {
    /*
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
        */
    // 테스트 메뉴. title은 transloco에 의해 id에 맞는 값으로 바뀌므로 의미없다.
    const _defaultNavigation: FuseNavigationItem[] = [
      {
        id: 'env',
        title: '환경 조회',
        type: 'basic',
        icon: 'heroicons_outline:chart-square-bar',
        link: '/admin/env',
      },
      /*
    {
      id: 'analysis',
      title: '환경 분석',
      type: 'collapsable',
      icon: 'heroicons_outline:table',
      link: '/admin/analysis',
      children: [
        {
          id: 'analysis.vegetative-reproductive',
          title: '영양/생식 분석',
          type: 'basic',
          link: '/admin/analysis/vegetative-reproductive',
        }
      ]
    },
    */
      {
        id: 'mentoring',
        title: '멘토링',
        type: 'collapsable',
        icon: 'heroicons_outline:clipboard-check',
        link: '/admin/mentoring',
        includeRole: [],
        children: [
          {
            id: 'mentoring.rule-list',
            title: '룰 조회/생성',
            type: 'basic',
            link: '/admin/mentoring/rule-list',
          },
          {
            id: 'mentoring.rule-statistics',
            title: '룰별 통계',
            type: 'basic',
            link: '/admin/mentoring/rule-statistics',
          },
          {
            id: 'mentoring.farm-statistics',
            title: '농장별 통계',
            type: 'basic',
            link: '/admin/mentoring/farm-statistics',
          },
          {
            id: 'mentoring.mentor-statistics',
            title: '멘토별 통계',
            type: 'basic',
            link: '/admin/metoring/mentor-statistics',
          },
        ],
      },
      {
        id: 'user-management',
        title: '회원 관리',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-check',
        link: '/admin/users',
        includeRole: [Role.SUPER_ADMIN, Role.ADMIN],
      },
      {
        id: 'device-management',
        title: '디바이스 관리',
        type: 'basic',
        icon: 'heroicons_outline:chip',
        link: '/admin/devices',
        includeRole: [Role.SUPER_ADMIN, Role.ADMIN],
        /*
        {
          id: 'sensor-management.external',
          title: '외부기상대',
          type: 'basic',
          link: '/admin/externals',
        },
        */
      },
      {
        id: 'growth',
        title: '생육수확 관리',
        type: 'collapsable',
        icon: 'heroicons_outline:collection',
        includeRole: [Role.SUPER_ADMIN, Role.ADMIN, this.config?.siteConfig?.code == 'fcdm' ? Role.USER : null],
        // includeRole: [Role.SUPER_ADMIN, Role.ADMIN,],
        children: [
          {
            id: 'growth.list',
            title: '생육조사 조회',
            type: 'basic',
            link: '/admin/growth',
          },
          {
            id: 'growth.properties',
            title: '작물별 조사항목 관리',
            type: 'basic',
            link: '/admin/growth/properties',
            includeRole: [Role.SUPER_ADMIN, Role.ADMIN],
          },
        ],
      },
    ];
    const defNav = this.translateNavItems(this.makeHidden(_defaultNavigation));
    const navs = {
      compact: defNav,
      default: defNav,
      futuristic: defNav,
      horizontal: defNav,
    };

    this._navigation.next(navs);
    return this._navigation.asObservable();
  }

  /**
   * includeRole, excludeRole로 hidden값을 세팅한다
   * @param navItems
   */
  makeHidden(navItems: FuseNavigationItem[]) {
    let role;
    if (this._userService.user) {
      role = this._userService.user.role;
    }

    const _navItems = cloneDeep(navItems);

    for (let item of _navItems) {
      if (role) {
        if (role && item.includeRole) {
          item.hidden = () => true;
          if (item.includeRole.includes(role)) {
            item.hidden = () => false;
          }
        }
        if (role && item.excludeRole) {
          if (item.excludeRole.includes(role)) {
            item.hidden = () => true;
          }
        }
      }

      if (item.children) {
        item.children = this.makeHidden(item.children);
      }
    }

    return _navItems;
  }

  /**
   * id로 매칭하여 번역한 결과를 돌려준다
   * @param navItems
   * @returns
   */
  translateNavItems(navItems: FuseNavigationItem[]) {
    const translated = cloneDeep(navItems);
    for (let item of translated) {
      let key = 'main-menu.' + item.id;
      if (item.type == 'collapsable') {
        key += '.root';
      }
      item.title = this._translocoService.translate(key);
      if (item.children) {
        item.children = this.translateNavItems(item.children);
      }
    }

    return translated;
  }
}
