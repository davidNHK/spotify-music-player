import type { InterceptHandler, Polly, Request } from '@pollyjs/core';
import type { Method } from 'axios';
import * as casual from 'casual';

export type MockHandlers = {
  [method in Method]?: {
    [pathName: string]:
      | jest.MockedFunction<InterceptHandler>
      | InterceptHandler;
  };
};

export type APIMock = {
  ipinfo?: MockHandlers;
  spotifyAPI?: MockHandlers;
  spotifyAccount?: MockHandlers;
};

function getMockHandler(req: Request, handlers?: MockHandlers) {
  const method = req.method.toUpperCase() as Method;
  const mockKey = req.pathname;
  if (!handlers) return undefined;
  const [mockHandler] = Object.entries(handlers)
    .filter(([targetMockMethod, mockingPath]) => {
      const normalizedMethodName = targetMockMethod.toUpperCase();
      return (
        normalizedMethodName === method &&
        mockingPath &&
        Object.keys(mockingPath).includes(mockKey)
      );
    })
    .map(([, mockingPath]) => {
      return mockingPath?.[mockKey];
    });
  if (!mockHandler) return undefined;
  return mockHandler;
}

function withMockHandler(
  handlers?: MockHandlers,
): (defaultHandler: InterceptHandler) => InterceptHandler {
  return function withDefaultHandler(
    defaultHandler: InterceptHandler,
  ): InterceptHandler {
    return function handler(req, res, interceptor) {
      const mockHandler = getMockHandler(req, handlers);
      if (mockHandler) {
        return mockHandler(req, res, interceptor);
      }
      interceptor.stopPropagation();
      return defaultHandler(req, res, interceptor);
    };
  };
}

export function setupMockServer(
  polly: Polly,
  options: {
    handlers?: APIMock;
  } = {},
) {
  const { handlers = {} } = options;
  polly?.server.get('https://ipinfo.io/json').intercept(
    withMockHandler(handlers.ipinfo)(function handler(_, res) {
      res.status(200).json({
        city: 'Hong Kong',
        country: 'HK',
        hostname: 'google.com',
        ip: '0.0.0.0',
        loc: '0,0',
        org: 'Star link',
        readme: 'https://ipinfo.io/missingauth',
        region: 'Universe',
        timezone: undefined,
      });
    }),
  );
  polly?.server.host('https://accounts.spotify.com', () => {
    polly?.server.post('/api/token').intercept(
      withMockHandler(handlers.spotifyAccount)(function handler(_, res) {
        res.status(200).json({
          access_token: 'accessTokenFromCode',
          refresh_token: 'refreshTokenFromCode',
        });
      }),
    );
  });
  polly?.server.host('https://api.spotify.com/v1', () => {
    const mockAPI = handlers?.spotifyAPI;
    polly?.server.put('/me/player').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(204);
      }),
    );
    polly?.server.get('/me/player/devices').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(200).json({ devices: [casual.DeviceObject()] });
      }),
    );
    polly?.server.put('/me/player/volume').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(204);
      }),
    );
    polly?.server.get('/me/player/currently-playing').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(200).json(casual.CurrentlyPlayingObject());
      }),
    );
    polly?.server.put('/me/player/seek').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(204);
      }),
    );
    polly?.server.get('/playlists/:playlistId').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(200).json(casual.PlaylistObject());
      }),
    );
    polly?.server.get('/tracks').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(200).json({
          tracks: [casual.TrackObject({})],
        });
      }),
    );
    polly?.server.get('/browse/featured-playlists').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(200).json({
          message: 'Unit test',
          playlists: casual.PagingObject([casual.SimplifiedPlaylistObject({})]),
        });
      }),
    );
    polly?.server.get('/me/top/artists').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(200).json(casual.PagingObject([casual.ArtistObject({})]));
      }),
    );
    polly?.server.get('/me/top/tracks').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(200).json(casual.PagingObject([casual.TrackObject({})]));
      }),
    );
    polly?.server.get('/recommendations').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res
          .status(200)
          .json(
            casual.RecommendationsObject([casual.SimplifiedTrackObject({})]),
          );
      }),
    );
    polly?.server.get('/me/player/recently-played').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res
          .status(200)
          .json(casual.CursorPagingObject([casual.PlayHistoryObject({})]));
      }),
    );
    polly?.server.get('/albums/:albumId').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(200).json(casual.AlbumObject());
      }),
    );
    polly?.server.get('/me/playlists').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(200).json({
          items: [casual.SimplifiedPlaylistObject({})],
        });
      }),
    );
    polly?.server.get('/me/player').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        const resBody = casual.CurrentlyPlayingContextObject({});
        res.status(200).json(resBody);
      }),
    );
    polly?.server.put('me/player/play').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(204);
      }),
    );
    polly?.server.put('me/player/pause').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(204);
      }),
    );
    polly?.server.put('me/player/shuffle').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(204);
      }),
    );
    polly?.server.put('me/player/repeat').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(204);
      }),
    );
    polly.server.post('me/player/next').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(204);
      }),
    );
    polly.server.post('me/player/previous').intercept(
      withMockHandler(mockAPI)(function handler(_, res) {
        res.status(204);
      }),
    );
  });
}
