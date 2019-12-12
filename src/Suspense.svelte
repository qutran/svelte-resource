<script context="module">
  import { tick, setContext, getContext } from 'svelte';

  const schedulerPromise = tick();
  const schedulerPromiseThen = schedulerPromise.then;
  schedulerPromise.then = then;

  function then(mbFlush, mbReject) {
    if (typeof mbReject === 'function') return mbFlush();

    return schedulerPromiseThen.call(schedulerPromise, mbFlush).catch(ex => {
      then(mbFlush);
      getContext('__suspense_catch')(ex);
    });
  }
</script>

<script>
  let pending = false;
  let error = null;

  const slots = $$props.$$slots;
  const originalSlot = slots.default[0];

  setContext('__suspense_catch', onCatch);

  function onCatch(ex) {
    (ex instanceof Promise ? schedulePending : scheduleException)(ex);
  }

  export function refresh() {
    pending = false;
    error = null;
  }

  function schedulePending(promise) {
    promise.finally(_ => (pending = false));
    pending = true;
  }

  function scheduleException(errorArg) {
    error = errorArg;
  }

  slots.default[0] = ctx => {
    try {
      return originalSlot(ctx);
    } catch (ex) {
      onCatch(ex);
    }
  };
</script>

{#if error}
  <slot name="error" {error} />
{:else if pending}
  <slot name="pending" />
{:else}
  <slot {refresh} />
{/if}
