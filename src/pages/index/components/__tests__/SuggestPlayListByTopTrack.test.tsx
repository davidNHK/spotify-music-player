import { render, screen } from '@testing-library/react';
import event from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';

import { TestApp } from '../../../../App';
import type { Props } from '../Present/PresentSuggestionList';
import { withSuggestPlayListByTopTrack } from '../SuggestPlayListByTopTrack';

jest.mock(
  '../../../../hooks/spotify/query/useSuggestedPlayListByUserTopTrack',
  () =>
    jest.fn().mockReturnValue({
      data: {
        playlists: [
          {
            id: 'example-playlist',
          },
        ],
        track: { name: 'track' },
      },
    }),
);

const SuggestPlayListByTopTrack = withSuggestPlayListByTopTrack(
  ({ onClickSuggestion, suggestions, title }: Props) => {
    return (
      <div>
        <h1>{title}</h1>
        {suggestions?.map(suggestion => {
          return (
            <button
              key={suggestion.id}
              onClick={() => onClickSuggestion(suggestion)}
            >
              Dummy
            </button>
          );
        })}
      </div>
    );
  },
);

describe('Test SuggestPlayListByTopTrack component', () => {
  it('have title', () => {
    render(
      <TestApp>
        <SuggestPlayListByTopTrack />
      </TestApp>,
    );
    expect(screen.getByText('More like track')).toBeVisible();
  });

  it('Click suggestion should jump to /playlist/:id', () => {
    const history = createMemoryHistory();
    render(
      <TestApp RouterProps={{ history }}>
        <SuggestPlayListByTopTrack />
      </TestApp>,
    );
    expect(screen.getByRole('button')).toBeVisible();
    event.click(screen.getByRole('button'));
    expect(history.entries[1].pathname).toEqual('/playlist/example-playlist');
  });
});