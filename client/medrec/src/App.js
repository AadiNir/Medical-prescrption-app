import React, { useState, useRef } from 'react';
import audioMetadata from 'audio-metadata';

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

    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const filename = `recording-${Date.now()}.flac`; // Generate unique filename

    const metadata = await audioMetadata(audioBlob);
      const convertedBlob = await audioMetadata.toBlob(audioBlob, 'flac', metadata);
    // const url = URL.createObjectURL(convertedBlob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = filename;
    // link.click();
    console.log(convertedBlob);

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
