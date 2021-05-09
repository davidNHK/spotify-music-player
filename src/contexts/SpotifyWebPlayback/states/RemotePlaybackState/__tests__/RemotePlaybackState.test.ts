import casual from 'casual';

import { createPollyContext } from '../../../../../../testHelper/polly/createPollyContext';
import { setupMockServer } from '../../../../../../testHelper/polly/setupMockServer';
import { createSpotifyAPIClientForTesting } from '../../../../../utils/createSpotifyAPIClient';
import { PlaybackState } from '../../../typings/Playback';
import { createPlaybackStateMachine } from '../../PlaybackState';
import { RemotePlaybackState } from '../index';

const context = createPollyContext({});

describe('RemotePlaybackState', () => {
  it('.getPlaybackState will transit state to IDLE without error when all fallback 204', async () => {
    setupMockServer(context.polly, {
      handlers: {
        spotifyAPI: {
          get: {
            '/v1/me/player': (_, res) => {
              res.status(204).send('');
            },
          },
        },
      },
    });
    const stateMachine = createPlaybackStateMachine(
      PlaybackState.PLAY_ON_REMOTE_PLAYBACK,
    );
    const apiClient = createSpotifyAPIClientForTesting();
    const state = new RemotePlaybackState({
      apiClient,
      stateMachine,
    });
    const playbackState = await state.getPlaybackState();
    expect(stateMachine.state).toEqual(PlaybackState.IDLE);
    expect(playbackState).toBeNull();
  });

  it('.getPlaybackState will transit state to PlayOnLocal', async () => {
    const currentPlayingContext = casual.CurrentlyPlayingContextObject();
    setupMockServer(context.polly, {
      handlers: {
        spotifyAPI: {
          get: {
            '/v1/me/player': (_, res) => {
              res.status(200).send(currentPlayingContext);
            },
          },
        },
      },
    });
    const stateMachine = createPlaybackStateMachine(
      PlaybackState.PLAY_ON_REMOTE_PLAYBACK,
    );
    const apiClient = createSpotifyAPIClientForTesting();
    const state = new RemotePlaybackState({
      apiClient,
      localPlayback: {
        _options: {
          id: currentPlayingContext.device.id,
        },
      } as any,
      stateMachine,
    });
    await state.getPlaybackState();
    expect(stateMachine.state).toEqual(PlaybackState.PLAY_ON_LOCAL_PLAYBACK);
  });

  it('.getPlaybackState return current player state and current track', async () => {
    const currentPlayingContext = casual.CurrentlyPlayingContextObject();
    setupMockServer(context.polly, {
      handlers: {
        spotifyAPI: {
          get: {
            '/v1/me/player': (_, res) => {
              res.status(200).send(currentPlayingContext);
            },
          },
        },
      },
    });
    const stateMachine = createPlaybackStateMachine(
      PlaybackState.PLAY_ON_REMOTE_PLAYBACK,
    );
    const apiClient = createSpotifyAPIClientForTesting();
    const state = new RemotePlaybackState({
      apiClient,
      stateMachine,
    });
    const playbackState = await state.getPlaybackState();
    expect(playbackState).toStrictEqual({
      actions: currentPlayingContext.actions,
      context: currentPlayingContext.context,
      device: currentPlayingContext.device,
      is_active: currentPlayingContext.device.is_active,
      is_paused: !currentPlayingContext.is_playing,
      progress_ms: currentPlayingContext.progress_ms,
      repeat_state: currentPlayingContext.repeat_state,
      shuffle_state: currentPlayingContext.shuffle_state,
      track: currentPlayingContext.item,
    });
  });

  it('.getPlaybackState skip return if current playing non track', async () => {
    const currentPlayingContext = casual.CurrentlyPlayingContextObject({
      currently_playing_type: 'episode',
    });
    context.polly.server.host('https://api.spotify.com/v1', () => {
      context.polly.server.get('/me/player').intercept((_, res) => {
        res.status(200).json(currentPlayingContext);
      });
    });
    const stateMachine = createPlaybackStateMachine(
      PlaybackState.PLAY_ON_REMOTE_PLAYBACK,
    );
    const apiClient = createSpotifyAPIClientForTesting();
    const state = new RemotePlaybackState({ apiClient, stateMachine });
    const playbackState = await state.getPlaybackState();
    expect(stateMachine.state).toEqual(PlaybackState.PLAY_ON_REMOTE_PLAYBACK);
    expect(playbackState).toBeNull();
  });
});
