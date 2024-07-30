import { FrontendMiddleware } from './frontend.middleware';

describe('FrontendMiddleware', () => {
  it('should be defined', () => {
    expect(new FrontendMiddleware()).toBeDefined();
  });
});
