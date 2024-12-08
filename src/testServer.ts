import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
	// Catch-all for unhandled requests
	http.get("*", ({ request }) => {
		console.error(`Add request handler for ${request.url.toString()}`);
		return HttpResponse.json(
			{ error: "Missing request handler." },
			{ status: 500 },
		);
	}),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export { server, http, HttpResponse };
