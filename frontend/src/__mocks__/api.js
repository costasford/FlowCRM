// Mock API for testing

const mockAPI = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

export const tasksAPI = {
  getAll: jest.fn(() => Promise.resolve({ data: [] })),
  create: jest.fn(() => Promise.resolve({ data: {} })),
  update: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve()),
};

export const dealsAPI = {
  getAll: jest.fn(() => Promise.resolve({ data: [] })),
  create: jest.fn(() => Promise.resolve({ data: {} })),
  update: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve()),
};

export const contactsAPI = {
  getAll: jest.fn(() => Promise.resolve({ data: [] })),
  create: jest.fn(() => Promise.resolve({ data: {} })),
  update: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve()),
};

export const activitiesAPI = {
  getAll: jest.fn(() => Promise.resolve({ data: [] })),
  create: jest.fn(() => Promise.resolve({ data: {} })),
  update: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve()),
};

export const companiesAPI = {
  getAll: jest.fn(() => Promise.resolve({ data: [] })),
  create: jest.fn(() => Promise.resolve({ data: {} })),
  update: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve()),
  getStats: jest.fn(() => Promise.resolve({ data: {} })),
};

export default mockAPI;