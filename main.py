from flask import Flask, request, send_file
import openai
# import soundfile as sf
import time
import os

from pydub import AudioSegment


app = Flask(__name__)
    # m4a_file = '1.m4a'

def fix_corrupted_wav(input_wav_file, output_wav_file):
    try:
        # Load the potentially corrupted .wav file
        audio = AudioSegment.from_wav(input_wav_file)

        # Check if the audio can be loaded without errors
        if audio:
            # Export the audio as a normal .wav file
            audio.export(output_wav_file, format="wav")
            print("successfull")
            return True
    except Exception as e:
        print(f"Error fixing corrupted WAV file: {e}")
    return False

# Example usage
input_wav_file = "C:/Users/HP/Downloads/recorded_audio_.wav"
output_wav_file = "fixed.wav"
if fix_corrupted_wav(input_wav_file, output_wav_file):
    print("Corrupted WAV file fixed successfully.")
    # Now you can proceed with processing the fixed WAV file
else:
    print("Failed to fix corrupted WAV file. Unable to proceed.")
# Call the function to check AudioSegment
@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    # Check if the request contains audio data
    
        
    file = request.files['audio']
    # output_wav_file = "fixed.wav"
    # fix_corrupted_wav


    # Use the converted WAV file path for recognition
    recognized_text = recognize_audio(file)
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
    
    # return {"error": "no file supported"}

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
