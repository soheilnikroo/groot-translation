import '@testing-library/jest-dom';

declare global {
  interface Window {
    fs: {
      readFile: jest.Mock;
      writeFile: jest.Mock;
    };
  }
}

global.window = global.window || {};
global.window.fs = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
};
