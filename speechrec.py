import speech_recognition as sr
import openai


def speech_to_text():
    # Initialize recognizer
    recognizer = sr.Recognizer()
    
    # Function to capture speech
    def capture_speech(prompt):
        print(prompt)
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)
            try:
                text = recognizer.recognize_google(audio)
                print(f"You said: {text}")
                return text
            except sr.UnknownValueError:
                print("Sorry, could not understand audio.")
                return None
            except sr.RequestError as e:
                print(f"Error fetching results: {e}")
                return None

    curr_date = capture_speech("Please state today's date (Ex: 2nd Feb 2024)")
    if curr_date is None:
        return None
    
    patient_name = capture_speech("Please state your name:")
    if patient_name is None:
        return None
    
    user_gender = capture_speech("please state your gender:")
    if user_gender is None:
        return None

    syndrome = capture_speech("Please state your syndrome:")
    if syndrome is None:
        return None

    medication = capture_speech("Please state your medication:")
    if medication is None:
        return None
    
    recommended_diet = capture_speech("please state if there is any change in diet")
    if recommended_diet is None:
        return None

    return curr_date,patient_name,user_gender, syndrome, medication,recommended_diet

def save_prescription(curr_date,patient_name, user_gender, syndrome, medication,recommended_diet):
    with open("prescriptionnew.txt", "w") as file:
        file.write(f"Date:{curr_date}\n")
        file.write(f"Patient Name: {patient_name}\n")
        file.write(f"Gender:{user_gender}")
        file.write(f"Syndrome: {syndrome}\n")
        file.write(f"Medication: {medication}\n")
        file.write(f"recommended diet: {recommended_diet}\n")

    openai.api_key = "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"
    model = "gpt-3.5-turbo"
    temperature = 0.9
    message_list = []
    system_message = {"role": "system", "content": "You are a prescption generator bot,(as it's an audio to text transcripted if there are any error or spelling mistake please rectify it) identify the date and year, name, gender, symptoms, medication, also suggestive activities "}

    message_list.append(system_message)
    user_message = {"role": "user", "content": "february 2024 Aditya Niranjan male cough and cold Ayurveda goggles salt water"}
message_list.append(user_message)
response_message = openai.ChatCompletion.create(model=model, messages=message_list, temperature=temperature)

response = response_message.choices[0].message.content

print(response)
        

        


if __name__ == "__main__":
    prescription_info = speech_to_text()
    if prescription_info:
        curr_date,patient_name,user_gender, syndrome, medication,recommended_diet= prescription_info
        save_prescription(curr_date,patient_name, user_gender,syndrome, medication,recommended_diet)
