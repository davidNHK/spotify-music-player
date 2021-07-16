import { render, screen } from '@testing-library/react';
import event from '@testing-library/user-event';
import casual from 'casual';
import { createMemoryHistory } from 'history';

import { createPollyContext } from '../../../../../testHelper/polly/createPollyContext';
import { setupMockServer } from '../../../../../testHelper/polly/setupMockServer';
import { TestApp } from '../../../../App';
import { withFeaturedPlayListBySpotify } from '../FeaturedPlayListBySpotify';
import type { Props } from '../Present/PresentSuggestPlayList';

const mockPlaylist = casual.SimplifiedPlaylistObject({});
const context = createPollyContext();

const FeaturedPlayListBySpotify = withFeaturedPlayListBySpotify(
  ({ title, suggestions, onClickSuggestion }: Props) => {
    return (
      <div>
        <h1>{title}</h1>
        <li>
          {suggestions?.map(suggestion => (
            <button
              key={suggestion.id}
              onClick={() => onClickSuggestion(suggestion)}
            >
              {suggestion.name}
            </button>
          ))}
        </li>
      </div>
    );
  },
);

describe('Test FeaturedPlayListBySpotify', () => {
  it('Click suggestion should jump to /playlist/:id', async () => {
    const history = createMemoryHistory();
    setupMockServer(context.polly, {
      handlers: {
        spotifyAPI: {
          get: {
            '/v1/browse/featured-playlists': (_, res) => {
              res.status(200).json({
                message: 'Testing title',
                playlists: casual.PagingObject([mockPlaylist]),
              });
            },
          },
        },
      },
    });
    render(
      <TestApp RouterProps={{ history }}>
        <FeaturedPlayListBySpotify />
      </TestApp>,
    );
    await expect(
      screen.findByRole('heading', { name: 'Testing title' }),
    ).resolves.toBeVisible();

    event.click(
      screen.getByRole('button', {
        name: mockPlaylist.name,
      }),
    );
    expect(history.entries[1].pathname).toEqual(`/playlist/${mockPlaylist.id}`);
  });
});
