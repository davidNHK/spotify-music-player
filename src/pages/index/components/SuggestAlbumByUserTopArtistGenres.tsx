import capitalize from 'lodash.capitalize';
import { ComponentType, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSuggestedAlbumByUserTopArtistGenres } from 'src/hooks/spotify/query/useSuggestedAlbumByUserTopArtistGenres';

import { useSpotifyWebPlayback } from '../../../contexts/SpotifyWebPlayback';
import { PresentSuggestAlbum, Props } from './Present/PresentSuggestAlbum';

export function withSuggestAlbumByUserTopArtistGenres(
  WrappedComponent: ComponentType<Props>,
) {
  return function WithSuggestAlbumByUserTopArtistGenres() {
    const history = useHistory();
    const { actions } = useSpotifyWebPlayback();
    const onClickToggleButton = useCallback(
      album => {
        actions.playOnUserPlayback({
          context_uri: album.uri,
          offset: { position: 0 },
        });
      },
      [actions],
    );
    const onClickAlbum = useCallback(
      album => {
        history.push(`/album/${album.id}`);
      },
      [history],
    );
    const response = useSuggestedAlbumByUserTopArtistGenres();

    return (
      <WrappedComponent
        data-testid="suggested-album-by-user-top-artists-genres"
        onClickSuggestion={onClickAlbum}
        onClickToggleButton={onClickToggleButton}
        suggestions={response?.data.albums}
        title={capitalize(response?.data?.genres[0])}
      />
    );
  };
}

export const SuggestAlbumByUserTopArtistGenres = withSuggestAlbumByUserTopArtistGenres(
  PresentSuggestAlbum,
);
