<script context="module">
  let cache = new Map();

  function createThrottle(throttle) {
    return new Promise(resolve => setTimeout(resolve, throttle));
  }

  function readCache(fn, throttle) {
    if (!cache.has(fn)) {
      const promise = fn()
        .then(module => cache.set(fn, module.default))
        .catch(console.error);
      cache.set(fn, promise);
      throw Promise.all([promise, createThrottle(throttle)]);
    }

    const fromCache = cache.get(fn);
    if (fromCache instanceof Promise) {
      throw Promise.all([fromCache, createThrottle(throttle)]);
    }
    return fromCache;
  }
</script>

<script>
  export let component;
  export let throttle = 0;
  const loadedComponent = readCache(component, throttle);
  let props;

  $: {
    const { component: _, throttle: __, ...mProps } = $$props;
    props = mProps;
  }
</script>

<svelte:component this={loadedComponent} {...props} />
