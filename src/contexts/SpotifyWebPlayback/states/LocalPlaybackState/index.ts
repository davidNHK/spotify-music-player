import type { AxiosInstance } from 'axios';

import { Command } from '../../typings/Command';
import {
  ActivePlaybackState,
  PlaybackState,
  PlaybackType,
} from '../../typings/Playback';
import { RepeatMode } from '../../typings/RepeatMode';
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

export class LocalPlaybackState implements ActivePlaybackState {
  readonly apiClient: AxiosInstance;

  readonly localPlayback: Spotify.SpotifyPlayer;

  readonly playbackType: PlaybackType = PlaybackType.Local;

  readonly refreshInterval: number = 500; // 0.5s

  readonly stateMachine: StateMachine;

  constructor(
    readonly options: {
      apiClient: AxiosInstance;
      localPlayback: Spotify.SpotifyPlayer;
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
          localPlayback: this.localPlayback,
        });
        break;
      case Command.PausePlayback:
        await pausePlayback({
          localPlayback: this.localPlayback,
        });
        break;
      case Command.PreviousTrack:
        await previousTrack({
          localPlayback: this.localPlayback,
        });
        break;
      case Command.ResumePlayback:
        await resumePlayback({
          localPlayback: this.localPlayback,
        });
        break;
      case Command.SeekPlayback:
        await seekPlayback({
          localPlayback: this.localPlayback,
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
          localPlayback: this.localPlayback,
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
    const state = await this.localPlayback.getCurrentState();
    if (!state) {
      if (this.stateMachine.can(PlaybackState.PLAY_ON_REMOTE_PLAYBACK))
        this.stateMachine.playOnRemotePlayback();
      return null;
    }
    const currentVolume = await this.localPlayback.getVolume();
    const {
      context,
      disallows,
      position,
      paused,
      track_window,
      repeat_mode,
      shuffle,
    } = state;
    return {
      actions: { disallows },
      context,
      device: {
        id: this.localPlayback._options.id,
        is_active: true,
        is_private_session: false,
        is_restricted: false,
        name: this.localPlayback._options.name,
        type: 'Computer',
        volume_percent: currentVolume * 100,
      },
      is_active: true,
      is_paused: paused,
      progress_ms: position,
      repeat_state: {
        0: RepeatMode.Off,
        1: RepeatMode.Track,
        2: RepeatMode.Context,
      }[repeat_mode],
      shuffle_state: shuffle,
      track: track_window.current_track,
    };
  }
}
