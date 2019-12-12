import { tick } from 'svelte';
import { createSuspenseFixture } from './fixtures/createSuspenseFixture';

const raf = () => new Promise(requestAnimationFrame);

describe('Suspense', () => {
  it('should resolve for synchronus data', () => {
    const { getStatus, getData } = createSuspenseFixture(() => 42);

    expect(getStatus()).toEqual('resolved');
    expect(getData()).toEqual(42);
  });

  it('should handle error', () => {
    const { getStatus, getError } = createSuspenseFixture(() => {
      throw new Error('error text');
    });

    expect(getStatus()).toEqual('error');
    expect(getError()).toBeInstanceOf(Error);
    expect(getError().message).toEqual('error text');
  });

  it('should handle pending', () => {
    const { isPending } = createSuspenseFixture(() => {
      throw Promise.resolve();
    });

    expect(isPending()).toEqual(true);
  });

  it('should handle error on update', async () => {
    const { component, getError, getStatus } = createSuspenseFixture(() => 42);
    expect(getStatus()).toEqual('resolved');

    component.$set({
      getData() {
        throw new Error('error text');
      },
    });

    await raf();
    expect(getStatus()).toEqual('error');
    expect(getError()).toBeInstanceOf(Error);
    expect(getError().message).toEqual('error text');
  });

  it('should correctly done tick after mutation', done => {
    tick().then(done, () => {});
  });

  it('should correctly refresh suspended component', async () => {
    let iter = 0;
    const { getStatus, getError, getData, refresh } = createSuspenseFixture(
      () => {
        // throw on first iteration
        if (!iter++) throw new Error('error text');
        return 42;
      },
    );

    expect(getStatus()).toEqual('error');
    expect(getError().message).toEqual('error text');

    refresh();
    await raf();
    expect(getStatus()).toEqual('resolved');
    expect(getData()).toEqual(42);
  });
});
