import logo from './logo.svg';
import './App.css';
import axios from "axios";
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
      recorder.onstop = async () => {
        try {
          // Create the audio Blob object from audio chunks
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      
          // Set the audio URL for playback (optional)
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
      
          // Create a new FormData object
          const formData = new FormData();
      
          // Append the audio Blob to the FormData object with a file-like structure
          formData.append('audioBlob', audioBlob); // Set desired filename
      
          // Send the POST request to the server using Axios or Fetch API
          const response = await axios.post('http://127.0.0.1:5000/speech-to-text', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      
          // Handle the server response
          if (response.status === 200) {
            console.log('Audio sent and processed successfully:', response.data);
            // Access the processed text or other data from the response here
          } else {
            console.error('Error sending audio:', response.data);
            // Handle errors appropriately, e.g., display an error message to the user
          }
        } catch (error) {
          console.error('Error handling audio:', error);
          // Handle errors appropriately, e.g., display an error message to the user
        }
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
