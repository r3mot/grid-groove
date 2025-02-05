# 🎵 Grid Groovin  

> **An interactive Web Audio Step Sequencer powered by Tone.js**  
> Create and control music with adjustable step counts, BPM settings, and a full-featured mixing board with volume faders.  
> Includes an **on-screen keyboard** and offers **four preset synth options**.  

<img src="https://github.com/user-attachments/assets/ffc24f59-1858-4fcd-854e-6690464bf377" width="800" height="500" />

---

## 🚀 Getting Started  

Follow these steps to clone, install dependencies, and start the development server.  

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

Your dev server will be available at `http://localhost:3000`.  

---

## 🎛️ Customizing Samples  

You can replace the default drum samples by updating the audio files in the `public/audio` directory.  
Each sample's **filename** is used as the track name in the UI.  

### **Updating Sample Paths**  
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
];
```

Replace the file paths with the new samples you’ve added.  

---

## 🎨 Customizing Colors  

The default colors are mapped to each sample and persist across sessions.  
You can modify the colors by updating the `RGB_VALUES` array in [./lib/color.ts](https://github.com/r3mot/grid-groove/blob/main/src/lib/color.ts).  

### **Updating Colors**  
Open the file and modify the RGB values:  

```js
// lib/color.ts

const RGB_VALUES = [
  '239,68,68',  // Red
  '249,115,22', // Orange
  '245,158,11', // Amber
  '234,179,8',  // Yellow
  '132,204,22', // Lime
  '34,197,94',  // Green
  '16,185,129', // Emerald
  '20,184,166', // Teal
  '6,182,212',  // Cyan
  '14,165,233', // Sky
  '59,130,246', // Blue
  '99,102,241', // Indigo
  '139,92,246', // Violet
  '168,85,247', // Purple
  '217,70,239', // Fuchsia
  '236,72,153', // Pink
  '244,63,94',  // Rose
];
```

Once updated, your color changes will take effect on the next reload.

---

## License

MIT © [r3mot](https://github.com/r3mot)
