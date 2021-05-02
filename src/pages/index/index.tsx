import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import { ErrorFallback } from '../../components/ErrorFallback';
import { Suspense } from '../../components/Suspense/withSuspense';
import { FeaturedPlayListBySpotify } from './components/FeaturedPlayListBySpotify';
import { SuggestAlbumByUserLastPlayedArtists } from './components/SuggestAlbumByUserLastPlayedArtists';
import { SuggestAlbumByUserLastPlayedTracks } from './components/SuggestAlbumByUserLastPlayedTracks';
import { SuggestAlbumByUserTopArtistGenres } from './components/SuggestAlbumByUserTopArtistGenres';
import { SuggestAlbumByUserTopArtists } from './components/SuggestAlbumByUserTopArtists';
import { SuggestAlbumByUserTopTracks } from './components/SuggestAlbumByUserTopTracks';

const Container = styled.div`
  padding: 0 ${props => props.theme.spaces.xxxl};
  height: 100%;
`;
export function Suggestion() {
  return (
    <Container data-testid="user-suggestion">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense>
          <FeaturedPlayListBySpotify />
          <SuggestAlbumByUserTopArtists />
          <SuggestAlbumByUserTopTracks />
          <SuggestAlbumByUserTopArtistGenres />
          <SuggestAlbumByUserLastPlayedTracks />
          <SuggestAlbumByUserLastPlayedArtists />
        </Suspense>
      </ErrorBoundary>
    </Container>
  );
}
