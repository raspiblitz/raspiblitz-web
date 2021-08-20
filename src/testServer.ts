import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('*', (req, res, ctx) => {
    console.error(`Add request handler for ${req.url.toString()}`);
    return res(ctx.status(500), ctx.json({ error: 'Missing request handler.' }));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export { server, rest };
