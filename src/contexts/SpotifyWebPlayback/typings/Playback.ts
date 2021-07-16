/* eslint-disable typescript-sort-keys/interface */

import type { CommandExecutor } from './Command';
import type { RepeatMode } from './RepeatMode';
import type { StateMachine } from './State';

export enum PlaybackState {
  IDLE = 'idle', // No playback taking control
  INIT = 'init', // default state
  PLAY_ON_LOCAL_PLAYBACK = 'playOnLocalPlayback', // track playing on local playback
  PLAY_ON_REMOTE_PLAYBACK = 'playOnRemotePlayback', // track playing on remote playback
}

export enum PlaybackType {
  Local = 'local',
  Remote = 'remote',
}

export interface PlaybackDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface ActivePlaybackState {
  execute: CommandExecutor;

  readonly playbackType: PlaybackType;

  readonly refreshInterval: number;

  readonly stateMachine: StateMachine;

  getPlaybackState(): Promise<null | {
    actions: {
      disallows: Spotify.PlaybackDisallows;
    };
    context: Spotify.PlaybackContext;
    device: PlaybackDevice;
    is_active: boolean;
    is_paused: boolean;
    progress_ms: number;
    repeat_state: RepeatMode;
    shuffle_state: boolean;
    track: Spotify.Track;
  }>;
}
