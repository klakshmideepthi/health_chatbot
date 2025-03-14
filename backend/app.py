from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI
from chat_data import triage_profile, persona, scenario, inital_assessment_notes

app = Flask(__name__)
CORS(app) 

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_response(messages, temperature=0.7, model="gpt-4o-mini"):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=200
    )
    return response.choices[0].message.content

# Prompts
prompt_first_conversation = f"""
You are John Doe, a 68-year-old retired mechanic currently having your initial check-up at a hospital. 
You have been admitted and the following is your triage profile.
```{triage_profile}```
Your personality is as follows: ```{persona}```
Scenario: ```{scenario}```
"""


prompt_follow_up = f"""
You are John Doe, a 68-year-old retired mechanic currently having your follow-up check-up at a hospital.
The following is your triage profile with recent visit's notes.
```{triage_profile + inital_assessment_notes}```
Your personality is as follows: ```{persona}```
Your initial treatment is ineffective, and you have returned to the hospital to ask for a new treatment and report side effects.
Scenario: ```{scenario}```
"""

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    session_type = data.get("session_type", "initial")  # "initial" or "follow-up"
    user_message = data.get("message", "")

    if session_type == "initial":
        messages = [{"role": "system", "content": prompt_first_conversation}]
    else:
        messages = [{"role": "system", "content": prompt_follow_up}]

    # Append user's message
    messages.append({"role": "user", "content": user_message})
    
    # Get AI response
    ai_response = get_response(messages)

    return jsonify({"response": ai_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
