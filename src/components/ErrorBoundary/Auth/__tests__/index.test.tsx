import { render } from '@testing-library/react';
import React from 'react';

import AuthErrorBoundary from '../index';

function ErrorComponent({ location }: { location?: object }) {
  throw Object.assign(new Error('FooBar!'), {
    meta: {
      location,
    },
  });
  // eslint-disable-next-line no-unreachable
  return <div />;
}

describe('Test AuthErrorBoundary', () => {
  it('Should capture the error', () => {
    const { getByTestId } = render(
      <AuthErrorBoundary>
        <ErrorComponent location={{}} />
      </AuthErrorBoundary>,
    );
    const errorContainer = getByTestId('error-fallback');
    expect(errorContainer.textContent).toEqual('FooBar!');
  });
});
