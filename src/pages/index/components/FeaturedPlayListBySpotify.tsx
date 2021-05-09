import { ComponentType, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useFeaturedPlaylists } from 'src/hooks/spotify/query/useFeaturedPlaylists';

import { useSpotifyWebPlayback } from '../../../contexts/SpotifyWebPlayback';
import {
  PresentSuggestPlayList,
  Props,
} from './Present/PresentSuggestPlayList';

export function withFeaturedPlayListBySpotify(
  WrappedComponent: ComponentType<Props>,
) {
  return function WithFeaturedPlayListBySpotify() {
    const history = useHistory();
    const { actions } = useSpotifyWebPlayback();
    const onClickToggleButton = useCallback(
      playlist => {
        actions.playOnUserPlayback({
          context_uri: playlist.uri,
          offset: { position: 0 },
        });
      },
      [actions],
    );
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
