import { Agent } from 'node:http';

import axios from 'axios';

axios.defaults.httpAgent = new Agent({ keepAlive: false }); // axios setup to avoid socket hangup error

beforeAll(() => {
  return;
});

afterEach(async () => {
  return;
});

afterAll(async () => {
  return;
});
