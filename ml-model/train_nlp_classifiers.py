import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB

# Sample training data
content_samples = [
    ("Will post about the product", "poor"),
    ("I like the brand, I will share it", "poor"),
    ("I will do a post if selected", "poor"),
    ("Looking forward to the collab", "poor"),
    ("Can promote on my page", "poor"),
    ("Will show the item", "poor"),
    ("I will talk about the product on my page", "poor"),
    ("I'll share some stories", "poor"),
    ("Not sure yet, but I’ll create something", "poor"),
    ("Plan to post a photo", "poor"),
    ("Just excited to share", "poor"),
    ("Maybe a product review", "poor"),
    ("I'll think of something to post", "poor"),
    ("I will show the unboxing", "poor"),
    ("Will tag the brand in my reel", "poor"),
    ("Reel or story about the product", "poor"),
    ("One IG post planned", "poor"),
    ("Nothing much yet", "poor"),
    ("I’ll use it and post", "poor"),
    ("Random shoutout", "poor"),
    ("This is trash", "poor"),
    ("I don't know what to post, this sucks", "poor"),
    ("I hate this", "poor"),
    ("Shitty idea, not interested", "poor"),
    ("Don't like this product", "poor"),
    ("This is crap", "poor"),
    ("No way I'm doing this", "poor"),
    ("Worst product ever", "poor"),


    ("I'll post a reel with a review and link", "average"),
    ("Doing an unboxing video on IG", "average"),
    ("Plan to share how I use the product daily", "average"),
    ("Doing an Instagram story series on product", "average"),
    ("Step-by-step demo reel of product", "average"),
    ("I will make a YouTube short and tag the brand", "average"),
    ("A lifestyle post showing product integration", "average"),
    ("Using it in a day-in-the-life reel", "average"),
    ("Review blog + IG carousel planned", "average"),
    ("3 reels covering use cases and final feedback", "average"),
    ("Will share results after a week of use", "average"),
    ("Posting during a trending challenge", "average"),
    ("Using trending audio to promote product", "average"),
    ("Trying the brand for 7 days and sharing", "average"),
    ("Will do a comparison with competitors", "average"),
    ("Creating a before/after story", "average"),
    ("Plan to feature it in my skincare reel", "average"),
    ("Unboxing + discount code in caption", "average"),
    ("Adding swipe-up story for product page", "average"),
    ("Mention in monthly favorites post", "average"),

    ("Creating a scripted storytelling reel about how this product helped me", "good"),
    ("Will do a cinematic reel highlighting key features, benefits, and my experience", "good"),
    ("Unboxing + first impressions + 7-day review with testimonials", "good"),
    ("Incorporating the product into a viral trend challenge", "good"),
    ("Aesthetic carousel post explaining product ingredients and results", "good"),
    ("3-part story series with teaser, demo, and review", "good"),
    ("Making a before/after transformation reel for Instagram and YouTube Shorts", "good"),
    ("Doing a comparison reel with competitor + brand highlight", "good"),
    ("Hosting a live Q&A session while using the product", "good"),
    ("Building anticipation with countdown posts before reel drop", "good"),
    ("Using cinematic shots with storytelling for reel", "good"),
    ("Incorporating personal testimony with creative visuals and voice-over", "good"),
    ("Creating a mini vlog using the brand’s product in my daily routine", "good"),
    ("Posting a POV reel that emotionally connects with my audience", "good"),
    ("Using native TikTok-style cuts to engage audience", "good"),
    ("Featuring product across platforms with consistency", "good"),
    ("Collaborating with another creator for a crossover reel", "good"),
    ("Reel script includes hook, value, CTA, and close", "good"),
    ("Adding polls, quizzes, and swipe-ups in stories for engagement", "good"),
    ("Writing a blog with rich visuals and links to product", "good")
]


work_samples = [
    ("I have worked with 2 brands on Instagram", "medium"),
    ("Created 5+ YouTube videos for sponsors", "strong"),
    ("No experience yet", "weak"),
    ("Promoted a brand last month on my story", "medium"),
    ("Collaborated with Myntra & Amazon", "strong"),
    ("Haven't done promotions before", "weak"),
    ("Posted product review videos on YouTube", "strong"),
    ("Just starting out", "weak"),
    ("Featured in 3 ad campaigns", "strong"),
    ("Did a barter collab once", "medium"),
    ("Created 1 branded reel", "medium"),
    ("Never worked with a brand", "weak"),
    ("3 Instagram campaigns completed", "medium"),
    ("Featured in a paid YouTube promo", "strong"),
    ("Worked with 1 fashion brand", "medium"),
    ("No sponsored posts yet", "weak"),
    ("Handled a product launch series", "strong"),
    ("Few IG stories done for brands", "medium"),
    ("Big brand partnership in past", "strong"),
    ("Not done anything yet", "weak"),
    
    ("Worked with Nike, Adidas and Puma for product launches", "strong"),
    ("Sponsored campaign with Apple for iPhone release", "strong"),
    ("Long-term collaboration with Amazon India", "strong"),
    ("YouTube collab with Netflix and Prime Video", "strong"),
    ("Handled influencer marketing for Coca-Cola and Pepsi", "strong"),

    ("Promoted Myntra's summer collection", "medium"),
    ("Posted a product review for Samsung Galaxy", "medium"),
    ("One-time campaign with Zomato", "medium"),
    ("Received PR box from L'Oréal", "medium"),
    ("Collaborated once with Swiggy on a food challenge", "medium"),

    ("Commented on Flipkart post once", "weak"),
    ("Tagged H&M in a casual post", "weak"),
    ("Shared Apple product screenshot on story", "weak"),
    ("Mentioned Puma in my daily reel", "weak"),
    ("Wore Nike hoodie in a personal vlog", "weak")
]

# Split data
X_content, y_content = zip(*content_samples)
X_work, y_work = zip(*work_samples)

# Define pipelines
content_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", MultinomialNB())
])

work_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", MultinomialNB())
])

# Train models
content_pipeline.fit(X_content, y_content)
work_pipeline.fit(X_work, y_work)

# Save models
joblib.dump(content_pipeline, "content_classifier.pkl")
joblib.dump(work_pipeline, "work_classifier.pkl")

print("✅ NLP classifiers trained and saved.")
