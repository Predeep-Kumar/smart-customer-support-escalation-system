from agents.classifier_agent import classify_ticket
from agents.troubleshooter_agent import generate_solution
from agents.sentiment_agent import analyze_sentiment
from agents.escalation_agent import generate_escalation


# =====================================================
# MAIN PIPELINE
# =====================================================

def process_ticket(ticket: dict):


    # SAFE INPUT


    subject = ticket.get("subject", "No Subject")
    description = ticket.get("description", "").strip()



    # 1. CLASSIFICATION (FIXED)


    full_text = f"{subject} {description}"
    text_lower = full_text.lower()

    try:
        category, priority = classify_ticket(full_text)
    except Exception as e:
        print("Classifier Error:", e)
        category = "General"
        priority = "Medium"


    # 🔴 Security override (never overwritten)
    if any(w in text_lower for w in [
        "hack", "hacked", "breach",
        "stolen", "fraud", "scam"
    ]):
        category = "Security"
        priority = "Critical"


    # 2. SENTIMENT


    try:
        sentiment, risk, confidence = analyze_sentiment(description)

    except Exception as e:
        print("Sentiment Error:", e)

        sentiment = "Neutral"
        risk = "Low"
        confidence = 0.0



    # 3. AI SOLUTION


    try:
        solution_data = generate_solution(category, description)

        steps = solution_data.get("steps", [])
        message = solution_data.get("message", "")
        resolved = solution_data.get("resolved", False)

    except Exception as e:
        print("Solution Error:", e)

        steps = default_steps()
        message = "Our support team will contact you shortly."
        resolved = False



    # 4. STATUS FLOW (FIXED)


    # Start properly
    status = "Open"

    # AI started
    if steps or message:
        status = "In Progress"

    # Resolved by AI
    if resolved:
        status = "Resolved"



    # 5. ESCALATION LOGIC (SAFE)


    escalation = None


    high_risk = (
        priority == "Critical"
        or sentiment in ["Negative", "Urgent"]
        or risk == "High"
    )


    ## Auto resolve if not risky and has steps
    if resolved:
        status = "Resolved"

    # 4. STATUS FLOW (FINAL CLEAN)


    escalation = None

    high_risk = (
        priority == "Critical"
        or sentiment in ["Negative", "Urgent"]
        or risk == "High"
    )

    # Default state
    status = "In Progress"

    # If high risk → escalate
    if high_risk:
        status = "Escalated"

        try:
            escalation = generate_escalation(
                {
                    "subject": subject,
                    "description": description
                },
                category,
                priority,
                sentiment
            )
        except Exception as e:
            print("Escalation Error:", e)
            escalation = {
                "status": "Escalated",
                "summary": "Escalated for manual review"
            }

    # If safe + resolved → mark resolved
    elif resolved:
        status = "Resolved"

    # If safe but not resolved → keep in progress
    else:
        status = "In Progress"

    # 6. TIMELINE (REALISTIC)


    timeline = [

        {
            "step": "Ticket Submitted",
            "status": "completed"
        },

        {
            "step": "AI Processing",
            "status": "completed" if steps else "pending"
        },

        {
            "step": "Resolution",
            "status": "completed" if resolved else "pending"
        },

        {
            "step": "Escalation",
            "status": "completed" if status == "Escalated" else "skipped"
        }
    ]



    # 7. FINAL RESPONSE


    return {

        # Core
        "subject": subject,
        "category": category,
        "priority": priority,
        "sentiment": sentiment,
        "risk": risk,

        # Status
        "status": status,

        # Solution (Structured)
        "solution": {
            "steps": steps,
            "message": message,
            "resolved": resolved
        },

        # Escalation
        "escalation": escalation,

        # Timeline
        "timeline": timeline
    }


# HELPERS

def default_steps():

    return [
        "Verify your account information.",
        "Restart the application.",
        "Try again after some time.",
        "Contact customer support if needed."
    ]
