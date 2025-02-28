import { QueryClient } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation((callback) => {
  return {
    observe: jest.fn(() => {
      act(() => {
        callback([
          {
            isIntersecting: true,
            target: document.createElement('div'),
          },
        ]);
      });
    }),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
});

window.IntersectionObserver = mockIntersectionObserver;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

beforeEach(() => {
  queryClient.clear();
});
