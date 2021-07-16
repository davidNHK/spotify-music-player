import type { AlbumSimplified } from '../../hooks/spotify/typings/Album';
import type { PlaylistSimplified } from '../../hooks/spotify/typings/Playlist';
import { ReactComponent as Pause } from './pause.svg';
import { ReactComponent as Play } from './play.svg';

export interface Props<T> {
  className?: string;
  isBelongCurrentTrack: boolean;
  item: T;
  onClickToggleButton: (context: any) => void;
}

export function TogglePlayerPlayingStateButton({
  isBelongCurrentTrack,
  className,
  onClickToggleButton,
  item,
}: Props<AlbumSimplified | PlaylistSimplified>) {
  return (
    <button
      aria-label={'toggle-button'}
      className={className}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onClickToggleButton(item);
      }}
    >
      {isBelongCurrentTrack ? <Pause /> : <Play />}
    </button>
  );
}
