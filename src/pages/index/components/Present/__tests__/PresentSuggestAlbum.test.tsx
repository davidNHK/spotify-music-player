import { render, screen } from '@testing-library/react';
import events from '@testing-library/user-event';

import { TestApp } from '../../../../../App';
import { PresentSuggestAlbum } from '../PresentSuggestAlbum';

describe('Test render PresentSuggestAlbum component', () => {
  it('Should render nothing if given suggestion is undefined', () => {
    render(
      <TestApp>
        <PresentSuggestAlbum
          data-testid=""
          onClickSuggestion={jest.fn()}
          onClickToggleButton={jest.fn()}
          suggestions={undefined}
          title="Hello World"
        />
      </TestApp>,
    );
    expect(() => screen.getAllByText(/.+/)).toThrow();
  });
  it('Should render nothing if given suggestion is empty', () => {
    render(
      <TestApp>
        <PresentSuggestAlbum
          data-testid=""
          onClickSuggestion={jest.fn()}
          onClickToggleButton={jest.fn()}
          suggestions={[]}
          title="Hello World"
        />
      </TestApp>,
    );
    expect(() => screen.getAllByText(/.+/)).toThrow();
  });
  it('Should render Present component', () => {
    render(
      <TestApp>
        <PresentSuggestAlbum
          data-testid=""
          onClickSuggestion={jest.fn()}
          onClickToggleButton={jest.fn()}
          suggestions={[
            {
              artists: [
                // @ts-expect-error
                { name: 'Paul' },
                // @ts-expect-error
                { name: 'David' },
                // @ts-expect-error
                { name: 'Lady Gaga' },
              ],
              id: 'FooBarID',
              // @ts-expect-error
              images: [{ url: 'https://www.google.com' }],
              name: 'FooBar',
            },
          ]}
          title="Hello World"
        />
      </TestApp>,
    );
    expect(
      screen.getByRole('heading'),
      'Should set heading to title',
    ).toHaveTextContent('Hello World');
    expect(
      screen.getAllByRole('link'),
      'Should render suggestion to clickable link',
    ).toHaveLength(1);
    expect(
      screen.getByText('Paul,David,Lady Gaga'),
      'Should join artist name by ,',
    ).toBeVisible();
  });
  it('Should trigger onClickSuggestion when Suggestion clicked', () => {
    const onClickSuggestion = jest.fn();
    const suggestion = {
      artists: [],
      id: 'FooBarID',
      images: [{ url: 'https://www.google.com' }],
      name: 'FooBar',
    };
    render(
      <TestApp>
        <PresentSuggestAlbum
          data-testid=""
          onClickSuggestion={onClickSuggestion}
          // @ts-expect-error
          suggestions={[suggestion]}
          title="Hello World"
        />
      </TestApp>,
    );
    events.click(screen.getAllByRole('link')[0]);
    expect(onClickSuggestion).toHaveBeenCalledWith(suggestion);
  });
});
