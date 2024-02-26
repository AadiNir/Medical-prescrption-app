from flask import Flask, request
import openai

app = Flask(__name__)

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    # Check if the request contains audio data
    if 'audio' not in request.files:
        return "No audio file provided", 400
    
    # Get the audio file from the request
    audio_file = request.files['audio']

    # Process the audio file
    recognized_text = recognize_audio(audio_file)

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
