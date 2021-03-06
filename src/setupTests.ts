// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom';
import 'jest-expect-message';
import '../testHelper/casual';

import crypto from 'crypto';
// @ts-expect-error no type for this module
import MutationObserver from 'mutation-observer';
import { TextEncoder } from 'util';

global.MutationObserver = MutationObserver;
global.TextEncoder = TextEncoder;

// https://github.com/facebook/react/issues/11098
Object.assign(console, {
  error: jest.fn(),
});

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: any) =>
      new Uint8Array(crypto.randomBytes(arr.length)),
    subtle: {
      digest: (byteArray: any) =>
        new Uint8Array(crypto.createHash('SHA256').update(byteArray).digest()),
    },
  },
});

jest.mock('./contexts/SpotifyWebPlayback/hooks/useLocalSpotifyPlayback');
