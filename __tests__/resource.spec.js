import { createResource } from '../src';

const raf = () => new Promise(requestAnimationFrame);

describe('resource', () => {
  it('should correctly read resource', async () => {
    const resource = createResource(() => Promise.resolve(42));
    expect(resource.read).toThrow(Promise);
    await raf();
    expect(resource.read()).toEqual(42);
  });

  it('should correctly catch an error', async () => {
    const resource = createResource(() => Promise.reject(42));
    expect(resource.read).toThrow(Promise);
    await raf();
    expect(resource.read).toThrow(Error);

    const resource2 = createResource(() => Promise.reject(new Error('test')));
    expect(resource2.read).toThrow(Promise);
    await raf();
    expect(resource2.read).toThrow(Error);
  });

  it('should correctly invalidate resource', async () => {
    const resource = createResource(input => Promise.resolve(input));
    expect(() => resource.read(42)).toThrow(Promise);
    await raf();
    expect(resource.read(42)).toEqual(42);
    expect(() => resource.read(10)).toThrow(Promise);
    await raf();
    expect(resource.read(10)).toEqual(10);
  });

  it('should keep the promise', () => {
    const resource = createResource(input => Promise.resolve(input));
    expect(() => resource.read(42)).toThrow(Promise);
    expect(() => resource.read(42)).toThrow(Promise);
  });
});
