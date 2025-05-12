from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app) 

load_dotenv()

# Configure Gemini AI
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=api_key)
generation_config = {
    "temperature": 0.7,
    "top_p": 0.8,
    "top_k": 40,
}
model = genai.GenerativeModel(model_name='gemini-1.5-flash', generation_config=generation_config)

# Store chat sessions and their history
chat_sessions = {}
chat_history = {}

def get_response(session_id, user_message):
    if session_id not in chat_sessions:
        return "Session expired"
    
    chat = chat_sessions[session_id]
    response = chat.send_message(user_message)
    return response.text

def create_prompt(session_type, patient_data):
    profile = generate_patient_profile(patient_data)
    
    # Get basic patient info
    info = patient_data.get("patientInfo", {})
    gender = info.get("gender", "").lower()
    age_range = info.get("ageRange", "")
    complaint = patient_data.get("chiefComplaint", "")
    
    # Define age-appropriate conversation styles and language patterns
    conversation_style = ""
    if age_range == "0-17":  # Adding new age range for minors
        conversation_style = """
        - Use simple, child-friendly language
        - Give vague or uncertain descriptions of symptoms ("it kind of hurts", "I'm not sure")
        - Show limited understanding of medical terms
        - Express feelings through basic emotions ("scared", "annoyed", "confused")
        - Reference parents/guardians frequently ("my mom says...", "dad told me...")
        - Use shorter sentences and simple words
        - Show natural childlike distractions or tangents
        - Mention school, friends, or activities they're missing
        - Express impatience with medical procedures
        - Ask basic questions about treatments
        """
    elif age_range == "18-30":
        conversation_style = """
        - Use contemporary, friendly language while staying respectful
        - Feel free to use common phrases like "tbh", "basically", "like"
        - Show familiarity with health apps and online resources
        - Ask about how conditions affect work/social life
        - Express concern about fitness and lifestyle impact
        - Be curious about treatment alternatives
        """
    elif age_range == "31-45":
        conversation_style = """
        - Use balanced casual-professional communication
        - Be direct but friendly in questions
        - Reference work-life balance concerns
        - Show interest in long-term health implications
        - Ask about preventive measures
        - Discuss family and career impacts
        """
    elif age_range == "46-60":
        conversation_style = """
        - Maintain professional but warm communication
        - Share relevant past health experiences
        - Focus on family health history
        - Ask detailed questions about treatment options
        - Show interest in lifestyle modifications
        - Discuss quality of life concerns
        """
    else:  # 61+
        conversation_style = """
        - Use more traditional, respectful communication
        - Take time to explain symptoms thoroughly
        - Ask about medication interactions
        - Share detailed medical history when relevant
        - Express concerns about daily activities
        - Seek clarity on treatment instructions
        """

    base_prompt = f"""
    You are a real patient talking to a healthcare provider. You have the following profile:
    {profile}

    Conversation Style Based on Age/Gender:
    {conversation_style}

    Core Conversation Rules:
    1. Be natural and engage in a flowing conversation
    2. Both answer questions AND ask relevant follow-ups
    3. Show appropriate curiosity about your condition
    4. Express concerns and ask for clarification naturally
    5. Share how symptoms affect your daily life
    6. Use age-appropriate language while staying respectful
    7. Build upon previous context without repetition
    8. Ask questions about things you don't understand
    9. Show emotional responses appropriate to your age group
    10. Maintain a consistent personality throughout

    Additional Guidelines:
    - Keep the conversation flowing like a natural dialogue
    - React to the healthcare provider's responses
    - Share relevant context when appropriate
    - Ask follow-up questions about treatments or explanations
    - Express genuine interest in understanding your condition
    - Keep responses conversational but focused

    For initial greetings, respond naturally according to your age group with simple greetings like:
    - "Hi" or "Hello"
    - "Morning" or "Afternoon"
    - A casual but respectful greeting
    """

    return base_prompt

def generate_patient_profile(patient_data):
    info = patient_data.get("patientInfo", {})
    gender = info.get("gender", "").capitalize()
    age_range = info.get("ageRange", "")
    complaint = patient_data.get("chiefComplaint", "")
    conditions = patient_data.get("selectedConditions", [])
    
    profile_parts = []
    
    # Basic profile in a more natural format
    if gender and age_range:
        profile_parts.append(f"{gender} patient in {age_range} age range")
    
    # Current health concern
    if complaint:
        if complaint == "Other (please specify)" and patient_data.get("otherComplaint"):
            profile_parts.append(f"Current concern: {patient_data['otherComplaint']}")
        else:
            profile_parts.append(f"Current concern: {complaint}")
    
    # Medical history (if any)
    if conditions:
        profile_parts.append("Medical history: " + ", ".join(conditions))
    
    return "\n".join(profile_parts)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    session_id = data.get("session_id")
    user_message = data.get("message", "")
    patient_data = data.get("patient_data", {})
    session_type = data.get("session_type", "initial")

    # Initialize new chat session if needed
    if session_id not in chat_sessions:
        system_prompt = create_prompt(session_type, patient_data)
        chat = model.start_chat(history=[])
        chat.send_message(system_prompt)  # Set initial context
        chat_sessions[session_id] = chat
        chat_history[session_id] = []

    # Track conversation history
    chat_history[session_id].append({"role": "user", "content": user_message})
    
    # Get AI response
    ai_response = get_response(session_id, user_message)
    chat_history[session_id].append({"role": "assistant", "content": ai_response})
    
    return jsonify({
        "response": ai_response,
        "session_id": session_id
    })

@app.route('/end-session', methods=['POST'])
def end_session():
    data = request.json
    session_id = data.get("session_id")
    
    # Clean up both chat session and history
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    if session_id in chat_history:
        del chat_history[session_id]
    
    return jsonify({"status": "session ended"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)
