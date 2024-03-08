import React, { useState } from 'react';
import Recorder from 'recorder-js'; // Make sure to import the Recorder.js library

function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState('');
  const [recorderInstance, setRecorderInstance] = useState(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioContext = new AudioContext();
        const input = audioContext.createMediaStreamSource(stream);
        const recorder = new window.Recorder(input, { numChannels: 1 });
  
        // Store the recorder instance in state
        setRecorderInstance(recorder);
  
        // Start recording
        recorder.record();
  
        // Update the recording state
        setIsRecording(true);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  };
  

  const stopRecording = () => {
    if (recorderInstance) {
      recorderInstance.stop();
      setIsRecording(false);
      recorderInstance.exportWAV(createDownloadLink);
    }
  };

  const createDownloadLink = (blob) => {
    const url = URL.createObjectURL(blob);
    setRecordingUrl(url);
  };

  return (
    <div>
      <h1>Simple Recorder.js demo</h1>
      <p><small>Made by the <a href="https://addpipe.com" target="_blank" rel="noopener noreferrer">Pipe Video Recording Platform</a></small></p>
      <p>This demo uses <a href="https://github.com/mattdiamond/Recorderjs" target="_blank" rel="noopener noreferrer">Recorder.js</a> to record wav/PCM audio directly in the browser.</p>
      <div id="controls">
        {!isRecording ? (
          <button onClick={startRecording}>Record</button>
        ) : (
          <button onClick={stopRecording}>Stop</button>
        )}
      </div>
      {recordingUrl && (
        <div>
          <audio controls src={recordingUrl}></audio>
          <a href={recordingUrl} download="recording.wav">Download Recording</a>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
