import { useSpotifyWebPlayback } from '../index';

export function usePlayingContext() {
  const { error, data } = useSpotifyWebPlayback();
  if (
    error ||
    !data.currentPlaybackState ||
    !data.currentPlaybackState?.is_active ||
    data.currentPlaybackState?.is_paused
  )
    return null;
  return data.currentPlaybackState.context;
}
