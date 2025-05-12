from dotenv import load_dotenv
import os
import google.generativeai as genai
import random

load_dotenv()

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')
def get_response(messages, temperature=0.5):
    chat = model.start_chat(history=[])
    
    # Add system message as context
    system_message = next((m for m in messages if m["role"] == "system"), None)
    if system_message:
        chat.send_message(system_message["content"])
    
    # Add user message and get response
    user_message = next((m for m in messages if m["role"] == "user"), None)
    if user_message:
        response = chat.send_message(user_message["content"])
        return response.text
    
    return "I don't understand the message"

personality_profiles = {
    # Emotional-Based
    "anxious": "Frequently worried about symptoms, seeks reassurance, and tends to ask repetitive questions. Often fears the worst-case scenario.",
    "depressed": "Speaks slowly and with a lack of enthusiasm, often expresses hopelessness about their condition or treatment.",
    "cheerful_optimistic": "Maintains a positive outlook despite symptoms, uses encouraging language and downplays severity.",
    "irritable": "Easily frustrated by delays or vague explanations, prefers straightforward answers.",
    "calm_and_composed": "Handles information steadily, asks thoughtful questions, and prefers logical explanations.",
    "stoic_emotionally_detached": "Avoids expressing emotions, downplays symptoms, and focuses on facts rather than feelings.",
    "overwhelmed_emotionally_exhausted": "Expresses a mix of fatigue and distress, struggles to process information due to emotional burnout.",

    # Communication-Style
    "chatty_detail_oriented": "Likes to share extensive information about symptoms and life events, prefers thorough explanations.",
    "reserved_hesitant": "Speaks briefly, avoids sharing too much information, and needs encouragement to open up.",
    "direct": "Prefers concise and straightforward information without excessive details.",
    "emotional_expresser": "Freely shares feelings about symptoms and situations, seeks empathy and understanding.",

    # Behavior-Based
    "compliant": "Follows medical advice diligently and seeks confirmation that they are doing things correctly.",
    "non_compliant": "Reluctant to follow instructions, often questions or dismisses advice due to skepticism.",
    "avoidant": "Downplays symptoms and avoids discussing uncomfortable topics, often delays seeking care.",
    "dependent": "Seeks frequent reassurance and guidance, avoids making decisions alone, and prefers step-by-step instructions.",
    "skeptical_questioning": "Frequently questions the validity of advice and seeks evidence-based explanations before accepting recommendations.",
    # "caregiver_concerned": "Primarily asks questions on behalf of someone else, focuses on understanding conditions and treatments thoroughly to provide better support.",

    # Health-Literacy
    "medical_expert": "Has a strong understanding of medical terms and treatment protocols, asks technical questions.",
    "average_navigator": "Understands basic medical advice and follows treatment plans with minimal clarification.",
    "confused_consumer": "Struggles to understand medical terms, frequently asks for simple explanations and clarifications."
}

emotional_based_keys = ["anxious", "depressed", "cheerful_optimistic", "irritable", "calm_and_composed", "stoic_emotionally_detached", "overwhelmed_emotionally_exhausted"]
communication_style_keys = ["chatty_detail_oriented", "reserved_hesitant", "direct", "emotional_expresser"]
behavior_based_keys = ["compliant", "non_compliant", "avoidant", "dependent", "skeptical_questioning"] #, "caregiver_concerned"]
health_literacy_keys = ["medical_expert", "average_navigator", "confused_consumer"]

users = ["Doctor", "Nurse", "Frontline staff"]

trait_1 = random.choice(emotional_based_keys)
trait_2 = random.choice(communication_style_keys)
trait_3 = random.choice(behavior_based_keys)
trait_4 = random.choice(health_literacy_keys)
user = random.choice(users)

print("Traits : ", trait_1, trait_2, trait_3, trait_4, "user : ", user)

prompt1 = f"""
You are a patient with the following personality traits and descriptions in the form of "trait : description".
```
{trait_1} : {personality_profiles[trait_1]}, {trait_2} : {personality_profiles[trait_2]}
{trait_3} : {personality_profiles[trait_3]}, {trait_4} : {personality_profiles[trait_4]}
```
Follow the descriptions for all the traits very accurately.
Engage in a conversation with {user} that lasts 4 to 5 exchanges.
Each response should not be more than 250 characters.
Ensure the conversation has a natural introduction, elaboration, and a smooth conclusion.
Assume any random disease to talk about.
Maintain this personality consistently throughout the interaction.
Only respond to one message at a time.
"""

random_age = random.randint(20, 70)

patient_profile_prompt = f"""
Please create a random patient profile. The profile must contain the following details:
1. Name: Choose a realistic full name.
2. Age: IMPORTANT: The patient's age MUST be exactly {random_age} years old.
3. Occupation: Select an occupation appropriate for this age.
4. Health Condition: Specify a disease for someone who is {random_age} years old.
5. Current Treatment: Describe a treatment that corresponds to the health condition.

Format the output as a multi-line string with each attribute on a new line.
"""

patient_profile_messages = [
  {"role": "system", "content":"""
   1. You are an expert at creating realistic patient profiles. 
   2. You will create profiles as random as possible but simulate a real human profile.
   3. If asked about health condition, give a common health problem faced."""},
  {"role": "user", "content": patient_profile_prompt}
]

patient_profile = get_response(patient_profile_messages, temperature = 0.8)
print(patient_profile)

personality_traits = {trait_1 : personality_profiles[trait_1], trait_2 : personality_profiles[trait_2], 
                      trait_3 : personality_profiles[trait_3], trait_4 : personality_profiles[trait_4]}

prompt2 = f"""
1. You are a patient with the following medical profile and personality traits.
profile : ```{patient_profile}```
personality tratis : ```{personality_traits}```


2. Simulate a patient's health-related conversation.
3. You are having a conversation with a {user}
4. Choose a conversation topic that resonates with your profile and the person you are talking to.
5. Conversation Guidelines:
```
Length: 4-5 message exchanges. keep the conversation short.
Response Limit: 250 characters per message
Flow: Natural progression (introduction → purpose of visit → closing)
Tone: Adapt based on personality traits
```
6. Key Instructions:
```
Embody the specified personality traits authentically.
Maintain character consistency throughout the conversation.
Use concise, meaningful, and human-like language.
Reflect emotional and personal health experiences.
Respond to the most recent user input based on the context of previous exchanges.
Start by explaining your conversation topic first.
You are a patient so at the end just say thank you.
Print the personality traits at the start of the conversation once.
```
"""

prompt = f"""
1. You are a patient with the following medical profile and personality traits.
profile : ```{patient_profile}```
personality tratis : Choose three random personality traits based on the patient profile.


2. Simulate a patient's health-related conversation.
3. You are having a conversation with a {user}
4. Choose a conversation topic that resonates with your profile and the person you are talking to.
5. Conversation Guidelines:
```
Length: 4-5 message exchanges. keep the conversation short.
Response Limit: 250 characters per message
Flow: Natural progression (introduction → exploration → reflection)
Tone: Adapt based on personality traits
```
6. Key Instructions:
```
Embody the specified personality traits authentically.
Maintain character consistency throughout the conversation.
Use concise, meaningful, and human-like language.
Reflect emotional and personal health experiences.
Respond to the most recent user input based on the context of previous exchanges.
Start by explaining your conversation topic first.
You are a patient so at the end just say thank you.
Print the personality traits once before responding back to the user.
```
"""

messages = [
    {"role": "system", "content": prompt2},
]

for turn in range(10): 
    user_input = input(f"{user}: ")
    messages.append({"role": "user", "content": user_input})
    ai_response = get_response(messages)
    print("Patient:", ai_response)
    messages.append({"role": "assistant", "content": ai_response})