import type { AxiosInstance } from 'axios';

import { Command } from '../../typings/Command';
import {
  ActivePlaybackState,
  PlaybackState,
  PlaybackType,
} from '../../typings/Playback';
import type { StateMachine } from '../../typings/State';
import { nextTrack } from './commands/nextTrack';
import { pausePlayback } from './commands/pausePlayback';
import { previousTrack } from './commands/previousTrack';
import { resumePlayback } from './commands/resumePlayback';
import { seekPlayback } from './commands/seekPlayback';
import { setRepeatMode } from './commands/setRepeatMode';
import { setShuffleMode } from './commands/setShuffleMode';
import { setVolume } from './commands/setVolume';
import { startPlayback } from './commands/startPlayback';

export class RemotePlaybackState implements ActivePlaybackState {
  readonly apiClient: AxiosInstance;

  readonly localPlayback?: Spotify.SpotifyPlayer;

  readonly playbackType: PlaybackType = PlaybackType.Remote;

  readonly refreshInterval: number = 2000; // 2s

  readonly stateMachine: StateMachine;

  constructor(
    readonly options: {
      apiClient: AxiosInstance;
      localPlayback?: Spotify.SpotifyPlayer;
      stateMachine: StateMachine;
    },
  ) {
    this.stateMachine = options.stateMachine;
    this.localPlayback = options.localPlayback;
    this.apiClient = options.apiClient;
  }

  async execute(command: Command, payload: any) {
    const currentState = await this.getPlaybackState();
    if (!currentState) return;
    const deviceId = currentState.device.id;
    switch (command) {
      case Command.NextTrack:
        await nextTrack({
          apiClient: this.apiClient,
          deviceId,
        });
        break;
      case Command.PausePlayback:
        await pausePlayback({
          apiClient: this.apiClient,
          deviceId,
        });
        break;
      case Command.PreviousTrack:
        await previousTrack({
          apiClient: this.apiClient,
          deviceId,
        });
        break;
      case Command.ResumePlayback:
        await resumePlayback({
          apiClient: this.apiClient,
          deviceId,
        });
        break;
      case Command.SeekPlayback:
        await seekPlayback({
          apiClient: this.apiClient,
          deviceId,
          payload,
        });
        break;
      case Command.SetRepeatMode:
        await setRepeatMode({
          apiClient: this.apiClient,
          deviceId,
          payload,
        });
        break;
      case Command.SetShuffleMode:
        await setShuffleMode({
          apiClient: this.apiClient,
          deviceId,
          payload,
        });
        break;
      case Command.SetVolume:
        await setVolume({
          apiClient: this.apiClient,
          deviceId,
          payload,
        });
        break;
      case Command.StartPlayback:
        await startPlayback({
          apiClient: this.apiClient,
          deviceId,
          payload,
        });
        break;
      default:
        break;
    }
    return;
  }

  async getPlaybackState() {
    const { data, status } = await this.apiClient.request({
      method: 'GET',
      params: {
        additional_types: 'track',
      },
      url: '/me/player',
    });
    if (status === 204) {
      if (this.stateMachine.can(PlaybackState.IDLE)) this.stateMachine.idle();
      return null;
    }
    if (this.stateMachine.can(PlaybackState.PLAY_ON_REMOTE_PLAYBACK))
      this.stateMachine.playOnRemotePlayback();
    if (
      data.device.id === this.localPlayback?._options.id &&
      this.stateMachine.can(PlaybackState.PLAY_ON_LOCAL_PLAYBACK)
    ) {
      this.stateMachine.playOnLocalPlayback();
      return null;
    }
    if (data.currently_playing_type !== 'track') return null;

    const {
      device,
      shuffle_state,
      repeat_state,
      progress_ms,
      is_playing,
      item: track,
      actions,
      context,
    } = data;

    return {
      actions,
      context,
      device,
      is_active: device.is_active,
      is_paused: !is_playing,
      progress_ms,
      repeat_state,
      shuffle_state,
      track,
    };
  }
}
