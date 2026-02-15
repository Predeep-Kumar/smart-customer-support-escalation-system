from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


# Initialize analyzer once
analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment(text: str):
    """
    Analyze sentiment, urgency, and emotional risk
    Returns: sentiment, risk, confidence
    """

    if not text:
        return "Neutral", "Low", 0.0


    # VADER SENTIMENT

    scores = analyzer.polarity_scores(text)

    compound = scores["compound"]
    pos = scores["pos"]
    neg = scores["neg"]


    # BASE SENTIMENT

    if compound >= 0.4:
        sentiment = "Positive"
        risk = "Low"

    elif compound <= -0.4:
        sentiment = "Negative"
        risk = "High"

    else:
        sentiment = "Neutral"
        risk = "Medium"


    # URGENCY DETECTION

    urgent_keywords = [
        "urgent", "asap", "immediately",
        "right now", "today", "emergency",
        "cannot wait", "serious issue",
        "complaint"
    ]


    text_lower = text.lower()

    is_urgent = any(word in text_lower for word in urgent_keywords)


    if is_urgent:
        sentiment = "Urgent"
        risk = "High"


    # CONFIDENCE SCORE

    confidence = round(max(pos, neg), 2)


    # HIGH NEGATIVE OVERRIDE

    if neg > 0.6:
        sentiment = "Negative"
        risk = "High"


    return sentiment, risk, confidence
