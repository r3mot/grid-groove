import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import '@testing-library/jest-dom'

import { setupVitestCanvasMock } from 'vi-canvas-mock'
import '@/polyfils/roundRect'

expect.extend(matchers)
vi.mock('zustand')

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  setupVitestCanvasMock()
})
afterEach(() => {
  cleanup()
})
