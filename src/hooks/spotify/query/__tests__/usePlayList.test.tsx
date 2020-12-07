/** @jest-environment setup-polly-jest/jest-environment-jsdom */

import { renderHook } from '@testing-library/react-hooks';

import { TestApp } from '../../../../App';
import createPollyContext from '../../../../utils/tests/createPollyContext';
import usePlayList from '../usePlayList';

const _context = createPollyContext();
it('Return playlist info', async () => {
  const { result, waitForNextUpdate } = renderHook(
    () => usePlayList('37i9dQZF1DXdLtD0qszB1w'),
    {
      wrapper: ({ children }) => <TestApp>{children}</TestApp>,
    },
  );
  await waitForNextUpdate();
  expect(result.error).toBeUndefined();
  expect(
    result.current.data.tracks.items.every(item => item.track.type === 'track'),
  ).toBeTruthy();
});
