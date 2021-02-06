import type { AxiosResponse } from 'axios';
import { eqBy, prop, uniqWith } from 'ramda';

import type { AlbumSimplified } from '../typings/Album';
import type { TrackSimplified } from '../typings/Track';
import { useRecentPlayedTrack } from './useRecentPlayedTrack';
import { SeedType, useRecommendations } from './useRecommendations';

interface Response {
  albums: AlbumSimplified[];
  tracks: TrackSimplified[];
}

export function useSuggestedAlbumByUserLastPlayedTracks():
  | AxiosResponse<Response>
  | undefined {
  const recentPlayedTrack = useRecentPlayedTrack();
  const recommendations = useRecommendations(
    recentPlayedTrack?.data.items.map(item => item.track.id) ?? [],
    SeedType.SeedTracks,
  );
  if (!recommendations) return undefined;
  const {
    data: { tracks: recommendTracks },
  } = recommendations;

  const albums = uniqWith<AlbumSimplified, void>(
    // @ts-expect-error error come from ramda internal type
    eqBy(prop('id')),
    recommendTracks.map(track => track.album),
  );
  return {
    ...recommendations,
    data: {
      albums: albums,
      tracks: recentPlayedTrack?.data.items.map(item => item.track).slice(0, 5),
    },
  };
}
