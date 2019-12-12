import { render } from '@testing-library/svelte';
import Suspense from './SuspenseContainer';

export function createSuspenseFixture(requestData) {
  let data = void 0;
  let pending = false;
  let error = void 0;
  let refresh = () => {};

  const { component } = render(Suspense, {
    props: {
      getData: requestData,
      callback(nextData) {
        data = nextData;
        pending = false;
        error = void 0;
      },
      pendingFn() {
        data = void 0;
        pending = true;
        error = void 0;
      },
      errorFn(errorData) {
        data = void 0;
        pending = false;
        error = errorData;
      },
      refreshFn(_refresh) {
        refresh = _refresh;
      },
    },
  });

  return {
    getStatus() {
      if (typeof data !== 'undefined') return 'resolved';
      if (typeof error !== 'undefined') return 'error';
      return 'pending';
    },
    getData() {
      return data;
    },
    isPending() {
      return pending;
    },
    getError() {
      return error;
    },
    refresh,
    component,
  };
}
