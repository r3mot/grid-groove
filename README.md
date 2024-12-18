# Grid Groovin

> An interactive Web Audio Step Sequencer built with Tone.js. Create and control music with adjustable step counts, and BPM settings.
> Features a full mixing board with volume faders for precise sound control.
> Includes an on-screen keyboard (playable with your physical keyboard) offering 4 preset synth options.

<img src="https://github.com/user-attachments/assets/ffc24f59-1858-4fcd-854e-6690464bf377" width="800" height="500" />

 ## Getting Started
```shell
git clone https://github.com/r3mot/grid-groove
```
```shell
npm install
```
```shell
 npm run dev
```

## Replacing Samples
Replace the audio files in the ```public``` directory. The name of the file is used to name the track.
You'll then replace the sample paths found below:

```javascript

// /providers/store/sampleStore.ts

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

The deafult colors are stored in an object and mapped to the samples. These are persisted so they will only be applied once.
You can change them here

```javascript

// /lib/constants.ts
export const DISPLAY_COLORS = [
  { r: 51, g: 255, b: 51 }, // Green
  { r: 102, g: 255, b: 255 }, // Cyan
  { r: 204, g: 153, b: 255 }, // Purple
  { r: 153, g: 204, b: 255 }, // Light Blue
  { r: 255, g: 204, b: 153 }, // Orange
  { r: 255, g: 102, b: 102 }, // Red
  { r: 255, g: 255, b: 102 }, // Yellow
  { r: 255, g: 102, b: 255 }, // Pink
].map(({ r, g, b }) => ({
  primary: rgba(r, g, b, 1.0),
  muted: rgba(r, g, b, 0.5),
  contrast: rgba(r, g, b, 0.2),
}))

```
## License
MIT © [r3mot](https://github.com/r3mot)
