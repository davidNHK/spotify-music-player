import { ComponentType, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSuggestedAlbumByUserTopArtists } from 'src/hooks/spotify/query/useSuggestedAlbumByUserTopArtists';

import { PresentSuggestAlbum, Props } from './Present/PresentSuggestAlbum';

export function withSuggestAlbumByUserTopArtists(
  WrappedComponent: ComponentType<Props>,
) {
  return function WithSuggestAlbumByUserTopArtists() {
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
    const response = useSuggestedAlbumByUserTopArtists();

    return (
      <WrappedComponent
        data-testid="suggested-album-by-user-top-artists"
        onClickSuggestion={onClickAlbum}
        onClickToggleButton={onClickToggleButton}
        suggestions={response?.data.albums}
        title={`More like ${response?.data.artists[0].name}`}
      />
    );
  };
}

export const SuggestAlbumByUserTopArtists = withSuggestAlbumByUserTopArtists(
  PresentSuggestAlbum,
);
