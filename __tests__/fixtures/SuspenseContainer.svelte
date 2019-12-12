<script>
  import { Suspense } from '../../src';
  import Component from './Component';
  export let getData = () => 10;
  export let callback = () => {};
  export let pendingFn = () => {};
  export let errorFn = () => {};
  export let refreshFn = () => {};
</script>

<Suspense let:refresh>
  {refreshFn(refresh)}
  <Component {getData} {callback} />
  <div slot="pending">{pendingFn()}</div>
  <div slot="error" data-error let:error>{errorFn(error)}</div>
</Suspense>
