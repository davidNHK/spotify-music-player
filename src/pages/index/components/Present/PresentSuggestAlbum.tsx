import styled from 'styled-components';

import type { AlbumSimplified } from '../../../../hooks/spotify/typings/Album';
import { ReactComponent as Play } from './play.svg';

export interface Props {
  'data-testid': string;
  onClickSuggestion: (suggestion: AlbumSimplified) => void;
  onClickToggleButton: (suggestion: AlbumSimplified) => void;
  suggestions?: AlbumSimplified[];
  title: string;
}

const Container = styled.div`
  padding: ${props => props.theme.spaces.m} 0;
`;

const SuggestionsContainer = styled.article`
  display: flex;
  max-width: 100%;
  overflow: scroll;
`;

const Heading = styled.h1`
  font-size: ${props => props.theme.typography.size.xl};
  line-height: 1.6;
  display: block;
`;

const Suggestion = styled.a`
  display: block;
  width: 164px;
  min-width: 164px;
  padding: ${props => props.theme.spaces.xl} ${props => props.theme.spaces.xl}
    ${props => props.theme.spaces.m};
  background: ${props => props.theme.colors.contrast1};
  border-radius: 8px;
  text-decoration: none;
  margin-right: ${props => props.theme.spaces.m};
  :hover {
    cursor: pointer;
    background: ${props => props.theme.colors.contrast2};
  }
`;

const ToggleButton = styled.button`
  outline: none;
  border: 0;
  border-radius: 500px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 10;
  bottom: 8px;
  right: 8px;
  visibility: hidden;
  background-color: ${props => props.theme.colors.green};
  color: #fff;
  ${Suggestion}:hover & {
    visibility: visible;
  }
  :hover {
    transform: scale(1.06);
  }
`;

const SuggestionCover = styled.img`
  width: 100%;
  height: 164px;
  display: block;
  object-fit: cover;
  margin-bottom: ${props => props.theme.spaces.m};
`;

const SuggestionHeading = styled.section`
  height: 62px;
  overflow: hidden;
`;

const SuggestionName = styled.p`
  font-size: ${props => props.theme.typography.size.s};
  font-weight: bold;
  margin: 0px;
  color: ${props => props.theme.colors.foreground};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const SuggestionDescription = styled.span`
  display: block;
  font-size: ${props => props.theme.typography.size.xs};
  line-height: ${props => props.theme.typography.size.l};
  margin-top: ${props => props.theme.spaces.xxxs};
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.theme.colors.contrast4};
  margin-top: ${props => props.theme.spaces.xxxs};
  overflow: hidden;
`;

export function PresentSuggestAlbum({
  title,
  suggestions,
  onClickSuggestion,
  onClickToggleButton,
  'data-testid': dataTestId,
}: Props) {
  if (!suggestions || suggestions?.length === 0) return null;
  return (
    <Container data-testid={dataTestId}>
      <Heading>{title}</Heading>
      <SuggestionsContainer>
        {suggestions?.map(suggestion => (
          <Suggestion
            data-testid={`${dataTestId}-item`}
            href=""
            key={suggestion.id}
            onClick={e => {
              e.preventDefault();
              onClickSuggestion(suggestion);
            }}
          >
            <div
              style={{
                position: 'relative',
              }}
            >
              <SuggestionCover src={suggestion.images[0]?.url} />
              <ToggleButton
                aria-label={'play'}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClickToggleButton(suggestion);
                }}
              >
                <Play />
              </ToggleButton>
            </div>
            <SuggestionHeading>
              <SuggestionName>{suggestion.name}</SuggestionName>
              <SuggestionDescription>
                {suggestion.artists
                  .map(artist => artist.name)
                  .slice(0, 3)
                  .join(',')}
              </SuggestionDescription>
            </SuggestionHeading>
          </Suggestion>
        ))}
      </SuggestionsContainer>
    </Container>
  );
}
