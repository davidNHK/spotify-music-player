import { ComponentType, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSuggestedAlbumByUserLastPlayedTracks } from 'src/hooks/spotify/query/useSuggestedAlbumByUserLastPlayedTracks';

import { useSpotifyWebPlayback } from '../../../contexts/SpotifyWebPlayback';
import { PresentSuggestAlbum, Props } from './Present/PresentSuggestAlbum';

export function withSuggestAlbumByUserLastPlayedTracks(
  WrappedComponent: ComponentType<Props>,
) {
  return function WithSuggestAlbumByUserLastPlayedTracks() {
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
    const response = useSuggestedAlbumByUserLastPlayedTracks();

    return (
      <WrappedComponent
        data-testid="suggested-album-by-last-played-tracks"
        onClickSuggestion={onClickAlbum}
        onClickToggleButton={onClickToggleButton}
        suggestions={response?.data.albums}
        title={`Continue with ${response?.data.tracks[0].name}`}
      />
    );
  };
}

export const SuggestAlbumByUserLastPlayedTracks = withSuggestAlbumByUserLastPlayedTracks(
  PresentSuggestAlbum,
);
