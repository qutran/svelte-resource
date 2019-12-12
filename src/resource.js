const defaultInvalidate = (prev, next) => prev !== next;

export function createResource(fn) {
  let status = 'init';
  let promise = null;
  let cache = null;
  let prevArg = null;

  return {
    read(arg, invalidate = defaultInvalidate) {
      if (invalidate(prevArg, arg)) status = 'init';
      if (status === 'success') return cache;
      if (status === 'error') {
        const error = cache instanceof Error ? cache : new Error(cache);
        throw error;
      }

      prevArg = arg;

      if (status === 'init') {
        status = 'pending';
        promise = fn(arg)
          .then(data => {
            status = 'success';
            cache = data;
          })
          .catch(ex => {
            status = 'error';
            cache = ex;
          });
      }

      throw promise;
    },
  };
}
