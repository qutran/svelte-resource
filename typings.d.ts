import { SvelteComponent } from 'svelte/types/runtime';

export const Suspense: SvelteComponent;
export const Lazy: SvelteComponent;
export function createResource<T>(promiseCreator: () => Promise<T>): T;
