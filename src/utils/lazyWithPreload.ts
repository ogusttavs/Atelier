import {lazy, type ComponentType, type LazyExoticComponent} from 'react';

type LoadableComponent<T extends ComponentType<any>> = LazyExoticComponent<T> & {
  preload: () => Promise<{default: T}>;
};

export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{default: T}>,
): LoadableComponent<T> {
  const Component = lazy(factory) as LoadableComponent<T>;
  Component.preload = factory;
  return Component;
}
