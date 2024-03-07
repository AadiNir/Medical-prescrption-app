import React, { useState, useRef } from 'react';
import audioMetadata from 'audio-metadata';
import xhr from 'xhr';
import { audioBufferToWav } from 'audiobuffer-to-wav';

function App() {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  const mediaRecorderRef = useRef(null); // Use useRef for mediaRecorder

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioChunks([...audioChunks, event.data]);
    }
  };

  const handleDownload = async () => {
    if (audioChunks.length === 0) return;

    const filename = `recording-${Date.now()}.wav`; // Generate unique filename

    // const metadata = await audioMetadata(audioBlob);
      // const convertedBlob = await audioMetadata.toBlob(audioBlob, 'flac', metadata);
    // const url = URL.createObjectURL(audioBlob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = filename;
    // link.click();

// Assuming you have audioChunks containing the audio data
// Convert audio data to an AudioBuffer (assuming mono audio at 44100 Hz)
const audioContext = new AudioContext();
const audioBuffer = audioContext.createBuffer(1, audioChunks.length, 44100);
audioBuffer.copyToChannel(new Float32Array(audioChunks), 0);

// Convert AudioBuffer to WAV file
const wavBlob = audioBufferToWav(audioBuffer);

// Create a Blob from the WAV data
const audioBlob = new Blob([wavBlob], { type: 'audio/wav' });

    // // Optional cleanup (remove the link and revoke the object URL)
    // URL.revokeObjectURL(url);
    // link.remove();
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button onClick={handleDownload} disabled={!audioChunks.length}>
        Download Recording
      </button>
    </div>
  );
}

export default App;
