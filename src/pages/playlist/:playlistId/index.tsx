import type { ComponentType } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import { ErrorFallback } from 'src/components/ErrorFallback';
import { withSuspense } from 'src/components/Suspense/withSuspense';
import { usePlayList } from 'src/hooks/spotify/query/usePlayList';
import type { PlaylistFull } from 'src/hooks/spotify/typings/Playlist';
import styled from 'styled-components';

import { Heading } from './components/Heading';
import { PlayListTracksList } from './components/TracksList';

interface Props {
  playList?: PlaylistFull;
}

const Container = styled.div`
  padding: 0 ${props => props.theme.spaces.xxxl};
  height: 100%;
`;

export function withPlayList(Wrapper: ComponentType<Props>) {
  return function WithPlayList() {
    const { playlistId } = useParams<{
      playlistId: string;
    }>();
    const response = usePlayList(playlistId);
    return <Wrapper playList={response?.data} />;
  };
}

export function PresentPlayList({ playList }: Props) {
  return (
    <Container data-testid="/playlist/:playlistId">
      <Heading playList={playList} />
      <PlayListTracksList playList={playList} />
    </Container>
  );
}

export const PlaylistPage = withErrorBoundary<Props>(
  withSuspense(withPlayList(PresentPlayList)),
  {
    FallbackComponent: ErrorFallback,
  },
);
