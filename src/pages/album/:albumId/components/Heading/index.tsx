import type { AlbumFull } from 'src/hooks/spotify/typings/Album';
import { formatMS } from 'src/utils/formatMS';
import { getTrackListTotalDuration } from 'src/utils/getTrackListTotalDuration';
import styled from 'styled-components';

interface Props {
  album?: AlbumFull;
}

const Container = styled.section`
  display: flex;
  align-items: flex-end;
`;

const ContentContainer = styled.main`
  margin-left: ${props => props.theme.spaces.xxl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.size.xxl};
  line-height: 48px;
  margin: 0px;
  padding: ${props => props.theme.spaces.s} 0px;
`;

const Type = styled.span`
  font-size: ${props => props.theme.typography.size.xs};
`;

const Info = styled.section`
  margin: ${props => props.theme.spaces.xxxs} 0px 0px 0px;
  font-size: ${props => props.theme.typography.size.s};
  color: ${props => props.theme.colors.contrast4};
`;

const Creator = styled.figure`
  margin: 0px;
  font-weight: bold;
  color: ${props => props.theme.colors.foreground};
  display: inline-block;
`;

const ArtistName = styled.figcaption``;

const Meta = styled.span`
  &:before {
    content: '•';
    margin: 0px ${props => props.theme.spaces.xxxs};
  }
`;

const Cover = styled.figure`
  width: 192px;
  height: 192px;
  box-shadow: 0 4px 60px rgba(255, 255, 255, 0.5);
  margin: 0px;

  @media screen and (min-width: 1280px) {
    width: 232px;
    height: 232px;
  }
`;
const CoverImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

export function Heading({ album }: Props) {
  return (
    <Container data-testid="heading">
      <Cover>
        <CoverImage alt="cover-image" src={album?.images[0].url} />
      </Cover>
      <ContentContainer>
        <Type>ALBUM</Type>
        <Title>{album?.name}</Title>
        <Info>
          <Creator>
            <ArtistName>{album?.artists[0].name}</ArtistName>
          </Creator>
          <Meta>{album?.total_tracks} songs</Meta>
          <Meta>
            {formatMS(getTrackListTotalDuration(album?.tracks.items ?? []))}
          </Meta>
        </Info>
      </ContentContainer>
    </Container>
  );
}
