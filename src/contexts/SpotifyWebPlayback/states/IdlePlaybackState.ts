import type { AxiosInstance } from 'axios';

import {
  ActivePlaybackState,
  PlaybackState,
  PlaybackType,
  StateMachine,
} from './PlaybackState';
import { RepeatMode } from './RepeatMode';

export class IdlePlaybackState implements ActivePlaybackState {
  readonly apiClient: AxiosInstance;

  readonly localPlayback?: Spotify.SpotifyPlayer;

  readonly playbackType: PlaybackType = PlaybackType.Local;

  readonly refreshInterval: number = 5000; // 5s

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

  async getPlaybackState() {
    const currentPlaying = await this.getUserPlayTrack();
    if (!currentPlaying) return null;
    if (
      currentPlaying?.is_playing &&
      this.stateMachine.can(PlaybackState.PLAY_ON_REMOTE_PLAYBACK)
    ) {
      this.stateMachine.playOnRemotePlayback();
      return null;
    }
    if (currentPlaying.currently_playing_type !== 'track') return null;

    const currentVolume = this.localPlayback
      ? await this.localPlayback.getVolume()
      : 0;

    const { device, item: track, actions } = currentPlaying;

    return {
      actions,
      device: {
        ...device,
        volume_percent: currentVolume * 100,
      } as any,
      is_active: false,
      is_paused: true,
      progress_ms: 0,
      repeat_state: RepeatMode.Off,
      shuffle_state: false,
      track,
    };
  }

  private async getUserPlayTrack() {
    const { data, status } = await this.apiClient.request({
      method: 'GET',
      params: {
        additional_types: 'track',
      },
      url: '/me/player/currently-playing',
    });
    if (status === 204) {
      return this.getUserRecentlyPlayingTrack();
    }
    return {
      actions: data.actions,
      currently_playing_type: data.currently_playing_type,
      device: {
        is_active: data.is_playing,
      },
      is_playing: data.is_playing,
      item: data.item,
    };
  }

  private async getUserRecentlyPlayingTrack() {
    const { data, status } = await this.apiClient.request({
      method: 'GET',
      params: {
        additional_types: 'track',
        limit: 1,
      },
      url: '/me/player/recently-played',
    });
    if (status === 204) {
      return null;
    }
    const {
      items: [{ track: item }],
    } = data;
    if (!item) return null;
    return {
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
      currently_playing_type: item.type,
      device: {
        is_active: false,
      },
      is_playing: false,
      item: item,
    };
  }
}
