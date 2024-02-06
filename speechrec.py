import speech_recognition as sr

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

    # Capture syndrome
    syndrome = capture_speech("Please state your syndrome:")
    if syndrome is None:
        return None

    # Capture prescription
    medication = capture_speech("Please state your medication:")
    if medication is None:
        return None
    
    recommended_diet = capture_speech("please state if there is any change in diet")
    if recommended_diet is None:
        return None

    return curr_date,patient_name,user_gender, syndrome, medication,recommended_diet

def save_prescription(curr_date,patient_name, user_gender, syndrome, medication,recommended_diet):
    with open("prescription.txt", "w") as file:
        file.write(f"Date:{curr_date}\n")
        file.write(f"Patient Name: {patient_name}\n")
        file.write(f"Gender:{user_gender}\n")
        file.write(f"Syndrome: {syndrome}\n")
        file.write(f"Medication: {medication}\n")
        file.write(f"recommended diet: {recommended_diet}\n")
        

        
    print("Prescription saved to prescription.txt")

if __name__ == "__main__":
    prescription_info = speech_to_text()
    if prescription_info:
        curr_date,patient_name,user_gender, syndrome, medication,recommended_diet= prescription_info
        save_prescription(curr_date,patient_name, user_gender,syndrome, medication,recommended_diet)
