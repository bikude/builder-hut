'use client';

import { Component, type ReactNode } from 'react';

/**
 * Catches failures inside a WebGL layer and renders nothing instead of taking the whole
 * page down with it.
 *
 * Both `IronScene` and `MascotCanvas` are pure atmosphere — every page they sit on is
 * already complete without them. Nothing under an R3F `<Canvas>` is caught by Next's own
 * route-level error boundary in a way that lets the rest of the page keep rendering, so
 * without this a WebGL context failure (a GPU driver refusing a context, an extension
 * interfering, or any future asset load) would surface as "This page did not load" for a
 * visitor who never needed the decoration in the first place.
 */
export class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
