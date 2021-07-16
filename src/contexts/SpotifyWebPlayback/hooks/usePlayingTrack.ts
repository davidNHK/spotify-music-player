import { useSpotifyWebPlayback } from '../index';

export function usePlayingTrack() {
  const { error, data } = useSpotifyWebPlayback();
  if (
    error ||
    !data.currentPlaybackState ||
    !data.currentPlaybackState?.is_active
  )
    return null;
  return data.currentPlaybackState.track;
}
