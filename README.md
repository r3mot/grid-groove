# 🎵 Grid Groovin

**An interactive Web Audio Step Sequencer powered by Tone.js**

<img src="https://github.com/user-attachments/assets/ffc24f59-1858-4fcd-854e-6690464bf377" width="800" />

## Table of Contents

- [Development](#development)
  - [Docker (Recommended)](#docker-recommended)
  - [Local Node](#local-node)
- [Customizing Samples](#customizing-samples)
- [License](#license)

## Development

You can run this project using **Docker (recommended)** for consistent
environments, or directly with **local Node**.

### Docker (Recommended)

This ensures everyone uses the same Node version and dependencies.

**Requirements:**  
Docker Desktop (and optionally `make`).

All Docker commands must be run from the `dev` directory:

```sh
cd dev
```

**First run (build + start):**

```sh
make dev-build
```

Or without `make`:

```sh
docker compose up --build
```

**Next runs:**

```sh
make dev
# or
docker compose up
```

**Common tasks:**

- `make build`
- `make test`
- `make coverage`
- `make lint`
- `make pretty`
- `make shell`
- `make stop`

### Local Node

If you prefer running directly:

**Requirements:** Node **22.x**, npm  
If using `nvm`:

```sh
nvm use
```

Install deps and start dev server:

```sh
npm install
npm run dev
```

Your app will be available at `http://localhost:5173`.

## Customizing Samples

Replace audio files in `public/audio`.  
Each file’s **filename** becomes the track name in the UI.

Edit sample paths in:

```ts
// store/sampleStore.ts
const samplePaths = [
  '/audio/clhat.wav',
  '/audio/gathat.wav',
  '/audio/kick1.wav',
  '/audio/kick2.wav',
  '/audio/snare1.wav',
  '/audio/snare2.wav',
  '/audio/snap.wav',
  '/audio/ride.wav',
]
```

## License

MIT © [r3mot](https://github.com/r3mot)
