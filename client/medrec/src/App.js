import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function App() {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null); // Declare mediaRecorder as state variable

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
      setMediaRecorder(recorder); // Set mediaRecorder state
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // Check if mediaRecorder is defined before stopping
      setRecording(false);
    }
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}

export default App;
