import { render, screen, waitFor } from '@testing-library/react';
import events from '@testing-library/user-event';
import casual from 'casual';

import { TogglePlayerPlayingStateButton } from '../';

describe('Test TogglePlayerPlayingState', () => {
  it('default show the play icon', () => {
    render(
      <TogglePlayerPlayingStateButton
        isBelongCurrentTrack={false}
        item={casual.AlbumObject()}
        onClickToggleButton={jest.fn()}
      />,
    );
    expect(screen.getByText('play.svg')).toBeVisible();
  });

  it('show pause icon when current item belong to current track', () => {
    render(
      <TogglePlayerPlayingStateButton
        isBelongCurrentTrack={true}
        item={casual.PlaylistObject()}
        onClickToggleButton={jest.fn()}
      />,
    );
    expect(screen.getByText('pause.svg')).toBeVisible();
  });

  it('onClick button will call .onClickToggleButton', async () => {
    const item = casual.AlbumObject();
    const onClickToggleButton = jest.fn();
    render(
      <TogglePlayerPlayingStateButton
        isBelongCurrentTrack={false}
        item={item}
        onClickToggleButton={onClickToggleButton}
      />,
    );
    expect(screen.getByText('play.svg')).toBeVisible();
    events.click(
      screen.getByRole('button', {
        name: 'toggle-button',
      }),
    );
    await waitFor(() => expect(onClickToggleButton).toHaveBeenCalledWith(item));
  });
});
