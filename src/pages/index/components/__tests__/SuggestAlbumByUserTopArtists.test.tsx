import { render, screen } from '@testing-library/react';
import event from '@testing-library/user-event';
import casual from 'casual';
import { createMemoryHistory } from 'history';
import { TestApp } from 'src/App';

import { createPollyContext } from '../../../../../testHelper/polly/createPollyContext';
import { setupMockServer } from '../../../../../testHelper/polly/setupMockServer';
import type { Props } from '../Present/PresentSuggestAlbum';
import { withSuggestAlbumByUserTopArtists } from '../SuggestAlbumByUserTopArtists';

const mockArtist = casual.ArtistObject({});
const mockTrack = casual.SimplifiedTrackObject({});
const context = createPollyContext();

const SuggestPlayListByTopArtist = withSuggestAlbumByUserTopArtists(
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
              {suggestion.name}
            </button>
          );
        })}
      </div>
    );
  },
);
describe('Test SuggestAlbumByUserTopArtists component', () => {
  it('Click suggestion should jump to /album/:id', async () => {
    const history = createMemoryHistory();
    setupMockServer(context.polly, {
      handlers: {
        spotifyAPI: {
          get: {
            '/v1/me/top/artists': (_, res) => {
              res.status(200).json(casual.PagingObject([mockArtist]));
            },
            '/v1/recommendations': (_, res) => {
              res.status(200).json(casual.RecommendationsObject([mockTrack]));
            },
          },
        },
      },
    });
    render(
      <TestApp RouterProps={{ history }}>
        <SuggestPlayListByTopArtist />
      </TestApp>,
    );
    await expect(
      screen.findByRole('heading', { name: `More like ${mockArtist.name}` }),
    ).resolves.toBeVisible();

    event.click(screen.getByRole('button', { name: mockTrack.album.name }));
    expect(history.entries[1].pathname).toEqual(`/album/${mockTrack.album.id}`);
  });
});
