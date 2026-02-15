def generate_escalation(ticket: dict, category: str, priority: str, sentiment: str):

    # SAFE DATA EXTRACTION

    ticket_id = ticket.get("id") or "N/A"
    subject = ticket.get("subject") or "No Subject"
    description = ticket.get("description") or "No description provided"


    # ESCALATION LOGIC

    reason = []

    if priority == "Critical":
        reason.append("High priority issue")

    if sentiment in ["Negative", "Urgent"]:
        reason.append("Customer shows dissatisfaction")

    if not reason:
        reason.append("Issue not resolved automatically")


    reason_text = ", ".join(reason)


    # ACTION PLAN

    action_plan = [
        "Review ticket details",
        "Contact customer within 2 hours",
        "Assign senior support agent",
        "Provide permanent resolution"
    ]


    # FORMATTED SUMMARY

    summary = f"""
📌 ESCALATION SUMMARY

Subject     : {subject}

Category    : {category}
Priority    : {priority}
Sentiment   : {sentiment}

--------------------------------

📝 CUSTOMER ISSUE
{description}

--------------------------------

⚠️ ESCALATION REASON
{reason_text}

--------------------------------

✅ NEXT ACTIONS
- {action_plan[0]}
- {action_plan[1]}
- {action_plan[2]}
- {action_plan[3]}
"""


    # STRUCTURED RESPONSE

    return {
        "status": "Escalated",

        "ticket_id": ticket_id,
        "subject": subject,

        "category": category,
        "priority": priority,
        "sentiment": sentiment,

        "reason": reason,
        "actions": action_plan,

        "summary": summary.strip()
    }
