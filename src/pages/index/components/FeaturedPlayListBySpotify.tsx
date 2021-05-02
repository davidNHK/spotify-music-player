import { ComponentType, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useFeaturedPlaylists } from 'src/hooks/spotify/query/useFeaturedPlaylists';

import {
  PresentSuggestPlayList,
  Props,
} from './Present/PresentSuggestPlayList';

export function withFeaturedPlayListBySpotify(
  WrappedComponent: ComponentType<Props>,
) {
  return function WithFeaturedPlayListBySpotify() {
    const history = useHistory();
    const onClickToggleButton = useCallback(playlist => {
      // eslint-disable-next-line no-console
      console.log({ playlist });
    }, []);
    const onClickPlayList = useCallback(
      playlist => {
        history.push(`/playlist/${playlist.id}`);
      },
      [history],
    );
    const response = useFeaturedPlaylists();

    return (
      <WrappedComponent
        data-testid="featured-play-list"
        onClickSuggestion={onClickPlayList}
        onClickToggleButton={onClickToggleButton}
        suggestions={response?.data.playlists.items}
        title={response?.data.message}
      />
    );
  };
}

export const FeaturedPlayListBySpotify = withFeaturedPlayListBySpotify(
  PresentSuggestPlayList,
);
