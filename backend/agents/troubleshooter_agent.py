import requests
import json
from config import HF_TOKEN


# CONFIG

API_URL = "https://router.huggingface.co/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

TIMEOUT = 30


# MAIN FUNCTION

def generate_solution(category: str, description: str):

    if not description:
        description = "User reported a technical issue."



    # SYSTEM PROMPT (STRICT)


    system_prompt = """
You are a professional customer support assistant.

You MUST reply in this exact format:

STEPS:
1. Step one
2. Step two
3. Step three

MESSAGE:
Friendly reply

RESOLVED:
Yes or No

Do NOT add anything else.
"""


    user_prompt = f"""
Category: {category}

Issue:
{description}

Provide solution now.
"""


    payload = {
        "model": "openai/gpt-oss-20b:groq",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.4,
        "max_tokens": 400
    }



    # CALL API


    try:

        response = requests.post(
            API_URL,
            headers=HEADERS,
            json=payload,
            timeout=TIMEOUT
        )

        if response.status_code != 200:
            print("HF Status Error:", response.status_code)
            return fallback_solution()

        result = response.json()

        print("HF Chat Generator:", result)


    except Exception as e:

        print("HF Connection Error:", e)
        return fallback_solution()



    # VALIDATE RESPONSE


    if (
        not isinstance(result, dict)
        or "choices" not in result
        or not result["choices"]
    ):
        print("HF Invalid Response")
        return fallback_solution()



    # EXTRACT TEXT


    try:
        text = result["choices"][0]["message"]["content"].strip()

    except Exception:
        return fallback_solution()



    # PARSE RESPONSE


    steps = []
    message_lines = []
    resolved = False

    section = None


    for raw in text.splitlines():

        line = raw.strip()


        # Detect sections
        if line.upper().startswith("STEPS"):
            section = "steps"
            continue

        if line.upper().startswith("MESSAGE"):
            section = "message"
            continue

        if line.upper().startswith("RESOLVED"):
            section = "resolved"
            continue


        # Parse content
        if section == "steps":

            if line.startswith(("1.", "2.", "3.", "-", "*")):
                step = line.lstrip("0123456789.-* ").strip()

                if step:
                    steps.append(step)


        elif section == "message":

            if line:
                message_lines.append(line)


        elif section == "resolved":

            if "yes" in line.lower():
                resolved = True

            if "no" in line.lower():
                resolved = False


    message = " ".join(message_lines).strip()



    # SAFETY NET


    if not steps:
        steps = default_steps()

    if not message:
        message = "Please try the above steps. If your issue is resolved, click the Mark as 'Resolved' button below. If the problem persists, our support team will contact you shortly for further assistance."




    # RETURN CLEAN DATA


    return {
        "steps": steps,
        "message": message,
        "resolved": resolved,
        "raw": text
    }



# FALLBACK

def fallback_solution():

    return {
        "steps": default_steps(),
        "message": "Our team will contact you shortly.",
        "resolved": False,
        "raw": ""
    }



def default_steps():

    return [
        "Verify your account information.",
        "Restart the application.",
        "Try again after some time.",
        "Contact support if the issue continues."
    ]
