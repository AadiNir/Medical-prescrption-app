from flask import Flask, request
import openai
import soundfile as sf
import time
import os

from pydub import AudioSegment


app = Flask(__name__)
def convert(m4a_file):
    # Check if the file exists
    if not os.path.exists(m4a_file):
        return {'error': 'File not found'}

    # Check file extension
    if not m4a_file.endswith('.m4a'):
        return {'error': 'Invalid file format'}

    # Convert M4A to WAV
    audio = AudioSegment.from_file(m4a_file)
    wav_filename = os.path.splitext(m4a_file)[0] + '.wav'  # Change the extension to .wav
    audio.export(wav_filename, format='wav')

    return {'success': True, 'wav_filename': wav_filename}
@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    # Check if the request contains audio data
    
        
    # Get the audio file from the request
    audio_file = request.files['audio']

    # # Save the audio file to disk
    # filename = f'audio_{int(time.time())}.wav'  # Use current timestamp
    # audio_file.save(filename)

    # Process the audio file
    # Process the audio file
    m4a_path = 'uploaded.m4a'
    audio_file.save(m4a_path)

    conversion_result = convert(m4a_path)
    if 'wav_filename' in conversion_result:
        # Use the converted WAV file path for recognition
        recognized_text = recognize_audio(conversion_result['wav_filename'])
        # Your existing code continues...

        openai.api_key = "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"
        model = "gpt-3.5-turbo"
        temperature = 0.9
        message_list = []
        system_message = {"role": "system", "content": "You are a prescption generator bot,(as it's an audio to text transcripted if there are any error or spelling mistake please rectify it) identify the date and year, name, gender, symptoms, medication, also suggestive activities "}
        message_list.append(system_message)
        user_message = {"role": "user", "content": recognized_text}
        message_list.append(user_message)
        response_message = openai.ChatCompletion.create(model=model, messages=message_list, temperature=temperature)

        response = response_message.choices[0].message.content
        print(recognized_text)
        return response, 200
    
    return {"error": "no file supported"}

def recognize_audio(audio_file):
    # Import necessary libraries
    import speech_recognition as sr

    # Initialize the recognizer
    recognizer = sr.Recognizer()

    # Read the audio file
    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)

    # Use Google Speech Recognition to recognize the audio
    try:
        recognized_text = recognizer.recognize_google(audio_data)
        return recognized_text
    except sr.UnknownValueError:
        return "Sorry, could not understand audio."
    except sr.RequestError as e:
        return f"Error fetching results: {e}"

if __name__ == "__main__":
    app.run(debug=True)
