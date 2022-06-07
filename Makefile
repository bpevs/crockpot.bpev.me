start:
	deno run --allow-read --allow-env --allow-net source/main.ts

watch:
	deno run --allow-read --allow-env --allow-net --watch source/main.ts

test:
	deno fmt source && deno lint && deno check source/main.ts && deno test source
