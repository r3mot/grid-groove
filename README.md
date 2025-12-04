# **Grid Groovin**

### **Web Audio Step Sequencer (Tone.js)**

<img src="https://github.com/user-attachments/assets/ffc24f59-1858-4fcd-854e-6690464bf377" width="800" />

## **Contents**

- [Development Setup](#development-setup)
  - [Docker (Recommended)](#docker-recommended)
  - [Local Node Environment](#local-node-environment)
- [Customizing Samples](#customizing-samples)
- [License](#license)

## **Development Setup**

### **Docker (Recommended)**

Use Docker for a consistent and isolated development environment.

**Prerequisites:**

- Docker Desktop
- `make` (optional)

**Run all Docker commands from the `/dev` directory:**

```sh
cd dev
```

**Initial Build + Start**

```sh
make dev-build
# or
docker compose up --build
```

**Subsequent Runs**

```sh
make dev
# or
docker compose up
```

**Common Commands**

- `make build`
- `make test`
- `make coverage`
- `make lint`
- `make pretty`
- `make shell`
- `make stop`

### **Local Node Environment**

Use this method if developing without Docker.

**Requirements:**

- Node **22.x**
- Package manager: npm / yarn / pnpm / bun

**macOS / Linux**

```sh
nvm use
```

**Windows** (`nvm-windows` does not read `.nvmrc`)

```powershell
nvm use 22
```

**Install Dependencies + Start Dev Server**

Choose your preferred package manager:

```sh
# npm
npm install
npm run dev

# yarn
yarn install
yarn dev

# pnpm
pnpm install
pnpm dev

# bun
bun install
bun run dev
```

App runs at: `http://localhost:5173`

## **Customizing Samples**

Replace audio files in:

```
public/audio
```

Each file’s **filename** appears as a track name in the UI.

Update sample paths in:

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

## **License**

MIT © [r3mot](https://github.com/r3mot)
