// Streams the split game pack as a single index.pck response.
const PARTS = ["index.pck.part1","index.pck.part2","index.pck.part3"];
const PACK_BYTES = 138079860;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.endsWith('/index.pck')) {
		return;
	}
	event.respondWith(streamPack());
});

async function streamPack() {
	const responses = await Promise.all(PARTS.map((part) => fetch(part, { cache: 'force-cache' })));
	const failed = responses.find((response) => !response.ok);
	if (failed) {
		return new Response('Could not load the game pack: ' + failed.status, {
			status: 502,
			headers: { 'Content-Type': 'text/plain' },
		});
	}
	const bodies = responses.map((response) => response.body);
	const stream = new ReadableStream({
		start(controller) {
			let sent = 0;
			const pump = (index) => {
				if (index >= bodies.length) {
					controller.close();
					return;
				}
				const reader = bodies[index].getReader();
				const read = () => reader.read().then(({ done, value }) => {
					if (done) {
						pump(index + 1);
						return;
					}
					sent += value.length;
					controller.enqueue(value);
					read();
				}).catch((error) => controller.error(error));
				read();
			};
			pump(0);
		},
	});
	return new Response(stream, {
		headers: {
			'Content-Type': 'application/octet-stream',
			'Content-Length': String(PACK_BYTES),
		},
	});
}
