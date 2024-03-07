import React, { useState } from 'react';

const AudioRecorderAndDownloader = () => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = event => {
        setAudioChunks([...audioChunks, event.data]);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      // Create a link element
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'recorded_audio.wav'; // Set the file name for download
      document.body.appendChild(link);

      // Click the link to initiate download
      link.click();

      // Clean up: remove the link
      document.body.removeChild(link);

      // Revoke the object URL
      URL.revokeObjectURL(audioUrl);
    }
  };

  return (
    <div>
      <h1>Audio Recorder and Downloader</h1>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button onClick={downloadAudio} disabled={!audioUrl}>
        Download Recorded Audio
      </button>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorderAndDownloader;
