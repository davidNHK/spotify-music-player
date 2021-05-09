import { Image } from './shared/Image';
import { Paging } from './shared/Paging';
import { TrackFull } from './Track';
import { UserPublic } from './User';

interface PlayListTrack {
  added_at: string;
  added_by: UserPublic;
  is_local: boolean;
  track: TrackFull;
}

export interface PlaylistSimplified {
  collaborative: boolean;
  description: string | null;
  id: string;
  images: Image[];
  name: string;
  owner: UserPublic;
  public: boolean | null;
  snapshot_id: string;
  tracks: Paging<PlayListTrack>;
  type: 'playlist';
  uri: string;
}

export interface PlaylistFull extends PlaylistSimplified {
  followers: { total: number };
}
