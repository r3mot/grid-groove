# 🎵 Grid Groovin

> **An interactive Web Audio Step Sequencer powered by Tone.js**  

<img src="https://github.com/user-attachments/assets/ffc24f59-1858-4fcd-854e-6690464bf377" width="800" height="500" />

---

## Getting Started

Follow these steps to clone, install dependencies, and start the development
server.

### **Clone the Repository**

```sh
git clone https://github.com/r3mot/grid-groove
cd grid-groove
```

### **Install Dependencies**

```sh
npm install
```

### **Start the Development Server**

```sh
npm run dev
```

Your dev server will be available at `http://localhost:5173`.

---

## Customizing Samples

You can replace the default drum samples by updating the audio files in the
`public/audio` directory.  
Each sample's **filename** is used as the track name in the UI.


To change the sample paths used in the sequencer, update the file located at:

```js
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

Replace the file paths with the new samples you’ve added.

---

## License

MIT © [r3mot](https://github.com/r3mot)
