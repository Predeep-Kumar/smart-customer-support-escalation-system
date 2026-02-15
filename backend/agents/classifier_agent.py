import requests
from config import HF_TOKEN


# HuggingFace Zero-Shot Classification Model
API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli"


HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}


# Supported categories
CATEGORIES = [
    "Billing",
    "Technical",
    "Account",
    "Refund",
    "Security",
    "Order",
    "General"
]

# MAIN CLASSIFIER

def classify_ticket(text: str):

    if not text:
        return "General", "Low"

    text_lower = text.lower()

    # CALL HUGGINGFACE

    category = "General"

    try:
        payload = {
            "inputs": text,
            "parameters": {
                "candidate_labels": CATEGORIES
            }
        }

        response = requests.post(
            API_URL,
            headers=HEADERS,
            json=payload,
            timeout=15
        )

        result = response.json()
        print("HF RAW:", result)

        if isinstance(result, dict) and "labels" in result:
            category = result["labels"][0]

    except Exception as e:
        print("HF ERROR:", e)
        category = "General"

    # PRIORITY DETECTION (RULES)

    text_lower = text.lower()
    if any(w in text_lower for w in [
        # Refund & Money Back
        "refund", "money back", "return",
        "reversal", "chargeback",
        "cancel order", "cancel subscription",
        "wrong charge", "double charged",
        "not refunded", "pending refund"
    ]):
        category = "Refund"


    elif any(w in text_lower for w in [
        # Payments & Billing
        "payment", "pay", "paid",
        "billing", "bill", "invoice",
        "subscription", "renewal",
        "debit", "credit", "card",
        "upi", "paypal", "wallet",
        "transaction failed",
        "payment failed",
        "auto debit"
    ]):
        category = "Billing"


    elif any(w in text_lower for w in [
        # Technical / System
        "error", "bug", "crash", "crashing",
        "not working", "doesn't work",
        "failed", "failure",
        "loading", "stuck", "freeze", "frozen",
        "slow", "lag", "timeout",
        "network issue", "connection lost",
        "server down", "app down",
        "blank screen", "white screen",
        "update failed", "install failed"
    ]):
        category = "Technical"


    elif any(w in text_lower for w in [
        # Orders / Delivery / Product
        "order", "delivery", "delayed",
        "late delivery", "not delivered",
        "missing item", "damaged",
        "wrong item", "defective",
        "tracking", "shipment",
        "courier", "dispatch"
    ]):
        category = "Order"
        
    elif any(w in text_lower for w in [
        # Account & Security
        "account", "login", "log in", "signin", "sign in",
        "password", "reset password", "forgot password",
        "hacked", "hack", "compromised", "breach",
        "suspended", "locked", "blocked",
        "two factor", "2fa", "otp", "verification",
        "email changed", "phone changed"
    ]):
        category = "Account"

    else:
        category = "General"


    # PRIORITY DETECTION (Improved)

    if any(w in text_lower for w in [
        # Critical / Emergency
        "hacked", "hack", "breach",
        "fraud", "scam", "stolen",
        "urgent", "asap", "immediately",
        "right now", "emergency",
        "account taken", "money lost",
        "security issue",
        "legal action", "police",
        "lawsuit"
    ]):
        priority = "Critical"


    elif any(w in text_lower for w in [
        # High Priority
        "not working", "stopped working",
        "failed", "error",
        "unable to", "can't",
        "cannot", "won't",
        "blocked", "locked",
        "payment failed",
        "order delayed",
        "very slow"
    ]):
        priority = "High"


    elif any(w in text_lower for w in [
        # Medium Priority
        "problem", "issue", "trouble",
        "delay", "slow",
        "confusing", "difficult",
        "inconvenient",
        "not sure",
        "need help"
    ]):
        priority = "Medium"


    else:
        priority = "Low"
    print("FINAL CATEGORY:", category)
    print("FINAL PRIORITY:", priority)

    return category, priority