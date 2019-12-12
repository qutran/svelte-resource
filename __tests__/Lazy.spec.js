import { render } from '@testing-library/svelte';
import { Lazy } from '../src';
import Component from './fixtures/Component';

const raf = () => new Promise(requestAnimationFrame);
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Lazy', () => {
  it('should throw promise', () => {
    const createElement = () =>
      render(Lazy, {
        props: {
          component: () => Promise.resolve({ default: Component }),
        },
      });

    expect(createElement).toThrow(Promise);
  });

  it('should render component after resolve', async () => {
    let result = null;
    const lazyComponent = () => Promise.resolve({ default: Component });
    const createElement = () => {
      return render(Lazy, {
        props: {
          component: lazyComponent,
          getData: () => 42,
          callback: received => (result = received),
        },
      });
    };

    expect(createElement).toThrow(Promise);
    await raf();
    expect(createElement()).toBeDefined();
    expect(result).toEqual(42);
  });

  it('should to throttle resolved component', async () => {
    const promiseSpy = jest.fn();
    const spy = jest.fn();
    const lazyComponent = () => Promise.resolve({ default: Component });
    const createElement = () => {
      return render(Lazy, {
        props: {
          component: lazyComponent,
          throttle: 100,
          getData: () => 42,
          callback: received => (result = received),
        },
      });
    };

    expect(createElement).toThrow(Promise);
    try {
      createElement();
    } catch (promise) {
      spy();
      promise.then(promiseSpy);
      await timeout(80);
      expect(promiseSpy).not.toBeCalled();
      await timeout(21);
      expect(promiseSpy).toBeCalled();
    } finally {
      expect(spy).toBeCalled();
    }
  });
});
