import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { getDestination, Recorder } from 'tone'
import * as lamejs from '@breezystack/lamejs'

export function Recording() {
  const recorder = useRef<Recorder | null>(null)
  const [recordingInProgress, setRecordingInProgress] = useState(false)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContext = new AudioContext()

  useEffect(() => {
    recorder.current = new Recorder()
    getDestination().connect(recorder.current)

    return () => {
      recorder.current?.dispose()
    }
  }, [])

  function startRecording() {
    if (recorder.current) {
      recorder.current.start()
      setRecordingInProgress(true)
      setElapsedTime(0)

      // Start elapsed time counter
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
  }

  async function stopRecording() {
    if (recorder.current) {
      const recordingBlob = await recorder.current.stop()

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      const audioBuffer = await decodeBlobToAudioBuffer(recordingBlob)
      const mp3Blob = encodeMp3(audioBuffer)

      const url = URL.createObjectURL(mp3Blob)
      setRecordingUrl(url)
      setRecordingInProgress(false)
    }
  }

  function decodeBlobToAudioBuffer(blob: Blob): Promise<AudioBuffer> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(blob)
      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        resolve(audioBuffer)
      }
    })
  }

  function encodeMp3(audioBuffer: AudioBuffer): Blob {
    const sampleRate = audioBuffer.sampleRate
    const channels = audioBuffer.numberOfChannels
    const mp3Encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128) // 128 kbps bitrate

    const channelData = []
    for (let i = 0; i < channels; i++) {
      channelData.push(audioBuffer.getChannelData(i))
    }

    const samples = channelData[0] // Mono audio for simplicity
    const mp3Data: Uint8Array[] = []
    const maxSamples = 1152

    let sampleBlock
    for (let i = 0; i < samples.length; i += maxSamples) {
      sampleBlock = samples.subarray(i, i + maxSamples)
      const int16SampleBlock = convertFloat32ToInt16(sampleBlock)
      const mp3buf = mp3Encoder.encodeBuffer(int16SampleBlock)
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf)
      }
    }

    const mp3buf = mp3Encoder.flush()
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf)
    }

    return new Blob(mp3Data, { type: 'audio/mp3' })
  }

  function downloadRecording() {
    if (recordingUrl) {
      const anchor = document.createElement('a')
      anchor.download = 'recording.mp3'
      anchor.href = recordingUrl
      anchor.click()
    }
  }
  function convertFloat32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      int16Array[i] = Math.min(1, float32Array[i]) * 0x7fff
    }
    return int16Array
  }

  return (
    <section>
      {/* Visual Indicator */}
      <div
        className={cn(
          recordingInProgress && 'bg-red-600 animate-pulse',
          'w-5 h-5 rounded-full',
        )}
      />
      <button onClick={startRecording} disabled={recordingInProgress}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recordingInProgress}>
        Stop Recording
      </button>

      {/* Show elapsed time */}
      {recordingInProgress && <p>Recording Time: {elapsedTime}s</p>}

      {/* Playback and download */}
      {recordingUrl && (
        <div>
          <audio src={recordingUrl} controls />
          <button onClick={downloadRecording}>Download Recording</button>
        </div>
      )}
    </section>
  )
}
