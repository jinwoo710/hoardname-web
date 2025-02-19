import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation((callback) => {

    return {
      observe: jest.fn(()=>{
        act(()=>{
        callback([
          {
            isIntersecting: true,
            target: document.createElement('div')
          }
        ])
    })}),
      unobserve: jest.fn(),
    };
  });

  window.IntersectionObserver = mockIntersectionObserver;