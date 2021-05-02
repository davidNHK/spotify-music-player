import { ComponentType, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSuggestedAlbumByUserLastPlayedTracks } from 'src/hooks/spotify/query/useSuggestedAlbumByUserLastPlayedTracks';

import { PresentSuggestAlbum, Props } from './Present/PresentSuggestAlbum';

export function withSuggestAlbumByUserLastPlayedTracks(
  WrappedComponent: ComponentType<Props>,
) {
  return function WithSuggestAlbumByUserLastPlayedTracks() {
    const history = useHistory();
    const onClickToggleButton = useCallback(album => {
      // eslint-disable-next-line no-console
      console.log({ album });
    }, []);
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
