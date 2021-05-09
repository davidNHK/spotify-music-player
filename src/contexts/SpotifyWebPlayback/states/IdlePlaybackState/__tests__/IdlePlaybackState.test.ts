import casual from 'casual';

import { createPollyContext } from '../../../../../../testHelper/polly/createPollyContext';
import { setupMockServer } from '../../../../../../testHelper/polly/setupMockServer';
import { createSpotifyAPIClientForTesting } from '../../../../../utils/createSpotifyAPIClient';
import { PlaybackState } from '../../../typings/Playback';
import { createPlaybackStateMachine } from '../../PlaybackState';
import { IdlePlaybackState } from '../index';

const context = createPollyContext({});
describe('IdlePlaybackState', () => {
  it(`.getPlaybackState will transit to ${PlaybackState.PLAY_ON_REMOTE_PLAYBACK} if currently playing track is_playing is true`, async () => {
    const currentlyPlaying = casual.CurrentlyPlayingObject({
      is_playing: true,
    });
    setupMockServer(context.polly, {
      handlers: {
        spotifyAPI: {
          get: {
            '/v1/me/player/currently-playing': (_, res) => {
              res.status(200).send(currentlyPlaying);
            },
          },
        },
      },
    });
    const stateMachine = createPlaybackStateMachine(PlaybackState.IDLE);
    const apiClient = createSpotifyAPIClientForTesting();
    const state = new IdlePlaybackState({
      apiClient,
      localPlayback: {
        getVolume: jest.fn().mockResolvedValue(0.1),
      } as any,
      stateMachine,
    });
    const playbackState = await state.getPlaybackState();
    expect(stateMachine.state).toEqual(PlaybackState.PLAY_ON_REMOTE_PLAYBACK);
    expect(playbackState).toBeNull();
  });

  it(`.getPlaybackState will keep IDLE if currently playing track is_playing is false`, async () => {
    const currentlyPlaying = casual.CurrentlyPlayingObject({
      is_playing: false,
    });
    setupMockServer(context.polly, {
      handlers: {
        spotifyAPI: {
          get: {
            '/v1/me/player/currently-playing': (_, res) => {
              res.status(200).send(currentlyPlaying);
            },
          },
        },
      },
    });
    const stateMachine = createPlaybackStateMachine(PlaybackState.IDLE);
    const apiClient = createSpotifyAPIClientForTesting();
    const state = new IdlePlaybackState({
      apiClient,
      localPlayback: {
        getVolume: jest.fn().mockResolvedValue(0.1),
      } as any,
      stateMachine,
    });
    const playbackState = await state.getPlaybackState();
    expect(stateMachine.state).toEqual(PlaybackState.IDLE);
    expect(playbackState).toStrictEqual({
      actions: { disallows: { resuming: true } },
      context: currentlyPlaying.context,
      device: { id: undefined, is_active: false, volume_percent: 10 },
      is_active: false,
      is_paused: true,
      progress_ms: 0,
      repeat_state: 'off',
      shuffle_state: false,
      track: currentlyPlaying.item,
    });
  });

  it(`.getPlaybackState will fallback to recently play if currently playing 204`, async () => {
    const currentlyPlaying = casual.PlayHistoryObject({});
    setupMockServer(context.polly, {
      handlers: {
        spotifyAPI: {
          get: {
            '/v1/me/player/currently-playing': (_, res) => {
              res.status(204);
            },
            '/v1/me/player/recently-played': (_, res) => {
              res
                .status(200)
                .json(casual.CursorPagingObject([currentlyPlaying]));
            },
          },
        },
      },
    });
    const stateMachine = createPlaybackStateMachine(PlaybackState.IDLE);
    const apiClient = createSpotifyAPIClientForTesting();
    const state = new IdlePlaybackState({
      apiClient,
      localPlayback: {
        getVolume: jest.fn().mockResolvedValue(0.1),
      } as any,
      stateMachine,
    });
    const playbackState = await state.getPlaybackState();
    expect(stateMachine.state).toEqual(PlaybackState.IDLE);
    expect(playbackState).toStrictEqual({
      actions: {
        disallows: {
          pausing: true,
          peeking_next: true,
          peeking_prev: true,
          resuming: false,
          seeking: true,
          skipping_next: true,
          skipping_prev: true,
        },
      },
      context: currentlyPlaying.context,
      device: {
        id: undefined,
        is_active: false,
        volume_percent: 10,
      },
      is_active: false,
      is_paused: true,
      progress_ms: 0,
      repeat_state: 'off',
      shuffle_state: false,
      track: currentlyPlaying.track,
    });
  });

  it(`.getPlaybackState will return if recently playing is podcast`, async () => {
    const currentlyPlaying = casual.CursorPagingObject([
      casual.PlayHistoryObject({
        track: {
          type: 'episode',
        },
      }),
    ]);
    setupMockServer(context.polly, {
      handlers: {
        spotifyAPI: {
          get: {
            '/v1/me/player/currently-playing': (_, res) => {
              res.status(204);
            },
            '/v1/me/player/recently-played': (_, res) => {
              res.status(200).json(currentlyPlaying);
            },
          },
        },
      },
    });
    const stateMachine = createPlaybackStateMachine(PlaybackState.IDLE);
    const apiClient = createSpotifyAPIClientForTesting();
    const state = new IdlePlaybackState({
      apiClient,
      localPlayback: {
        getVolume: jest.fn().mockResolvedValue(0.1),
      } as any,
      stateMachine,
    });
    const playbackState = await state.getPlaybackState();
    expect(stateMachine.state).toEqual(PlaybackState.IDLE);
    expect(playbackState).toBeNull();
  });
});
