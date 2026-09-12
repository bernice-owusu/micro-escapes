import os
import logging
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# --- Logging setup ---
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


# --- Micro Escapes Listings Dataset (connected to web app) ---
LISTINGS = [
    {
        "id": "exp-kokrobite-surf",
        "name": "Kokrobite Beach & Surf",
        "category": "beach",
        "location": "kokrobite / accra",
        "price": "GH₵40",
        "tags": ["beach", "budget", "relaxing", "ocean", "sunset", "accra", "surf"],
    },
    {
        "id": "exp-bliss-bowling",
        "name": "Bliss Family Entertainment",
        "category": "games",
        "location": "airport residential",
        "price": "GH₵80–160",
        "tags": ["bowling", "arcade", "fun", "games", "friends", "date", "accra"],
    },
    {
        "id": "exp-buka-courtyard",
        "name": "Buka Restaurant & Courtyard",
        "category": "restaurant",
        "location": "osu",
        "price": "GH₵60–120",
        "tags": ["local food", "affordable", "dining", "courtyard", "tilapia", "osu", "accra"],
    },
    {
        "id": "exp-sandbox-beach",
        "name": "Sandbox Beach Club",
        "category": "lounge",
        "location": "labadi",
        "price": "GH₵120–250",
        "tags": ["beach", "sunset", "cocktails", "luxury", "labadi", "accra"],
    },
    {
        "id": "exp-legon-botanical",
        "name": "Legon Botanical Gardens",
        "category": "nature",
        "location": "legon",
        "price": "GH₵20–50",
        "tags": ["canopy walk", "nature", "gardens", "lake", "adventure", "accra"],
    },
    {
        "id": "exp-wli-falls",
        "name": "Wli Waterfalls & Trails",
        "category": "adventure",
        "location": "volta",
        "price": "GH₵50",
        "tags": ["adventure", "nature", "hiking", "waterfall", "getaway", "volta"],
    },
    {
        "id": "exp-asanka-local",
        "name": "Asanka Local Courtyard",
        "category": "restaurant",
        "location": "osu",
        "price": "GH₵45–80",
        "tags": ["local food", "budget", "street bites", "kelewele", "osu", "accra"],
    },
    {
        "id": "exp-labadi-beach",
        "name": "Labadi Beach Resort",
        "category": "hotel",
        "location": "labadi",
        "price": "GH₵200+",
        "tags": ["beach", "luxury", "hotel", "pool", "labadi", "accra"],
    },
]

BASE_WEB_URL = os.getenv("MICRO_ESCAPES_URL", "https://micro-escapes.vercel.app").rstrip("/")


def search_listings(query: str):
    """Keyword matching against the Micro Escapes listings dataset."""
    query = query.lower()
    words = query.split()
    matches = []

    for item in LISTINGS:
        haystack = " ".join([item["name"], item["category"], item["location"]] + item["tags"]).lower()
        if any(word in haystack for word in words):
            matches.append(item)

    return matches


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Welcome to Micro Escapes!\n\n"
        "I'm your personal travel & outing assistant for Accra and Ghana.\n"
        "Whether you're planning a weekend getaway, looking for a cozy restaurant, "
        "or need a place to chill, I've got you covered.\n\n"
        "Here's what I can help you find:\n"
        "🍽️ Restaurants & local eateries\n"
        "🏨 Hotels & Airbnbs\n"
        "🌴 Getaways & adventures\n"
        "🏖️ Beaches & outdoor fun\n"
        "🎉 Activities, bowling & games\n\n"
        "🔍 How to search:\n"
        "Just send what you feel like doing — for example:\n"
        "• \"beach in Accra\"\n"
        "• \"bowling and games\"\n"
        "• \"budget food Osu\"\n"
        "• \"adventure Volta\"\n\n"
        f"🌐 Micro Escapes Web App: {BASE_WEB_URL}\n"
        f"📖 Cinematic Landing Story: {BASE_WEB_URL}/landing\n"
        "📱 WhatsApp Concierge: https://wa.me/233559184383\n\n"
        "Type /help anytime to see all commands."
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🛟 Micro Escapes Commands & Apps:\n\n"
        "/start — Welcome message and quick start\n"
        "/webapp — Link to the full interactive Web Application\n"
        "/landing — View the cinematic parallax landing story\n"
        "/wheel — Spin the Escape Wheel in your browser\n"
        "/map — Open the interactive Accra neighborhood map\n"
        "/help — Show this help message\n\n"
        "To search, simply type your mood or desire:\n"
        "• \"relax\"\n"
        "• \"beach\"\n"
        "• \"bowling\"\n"
        "• \"food\"\n\n"
        f"🌐 Web App: {BASE_WEB_URL}\n"
        f"📖 Landing Page: {BASE_WEB_URL}/landing"
    )


async def webapp_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        f"✨ Launch the Micro Escapes Web App:\n{BASE_WEB_URL}\n\n"
        "Features:\n"
        "• 6-step AI recommendation wizard\n"
        "• Interactive neighborhood map\n"
        "• Loyalty Passport & Rewards\n"
        "• Direct booking checkout"
    )


async def landing_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        f"📖 Experience the Micro Escapes Cinematic Story:\n{BASE_WEB_URL}/landing"
    )


async def wheel_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        f"🎡 Spin the Accra Escape Wheel:\n{BASE_WEB_URL}/?action=wheel"
    )


async def map_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        f"🗺️ Open the Interactive Accra Map:\n{BASE_WEB_URL}/?view=map"
    )


async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = update.message.text
    results = search_listings(message)

    if not results:
        await update.message.reply_text(
            f"I couldn't find a Micro Escape matching \"{message}\".\n\n"
            "Try searching:\n"
            "• \"beach\" or \"labadi\"\n"
            "• \"bowling\" or \"games\"\n"
            "• \"osu\" or \"restaurant\"\n"
            "• \"adventure\" or \"volta\"\n\n"
            f"Or explore everything on the Web App: {BASE_WEB_URL}"
        )
        return

    reply_lines = [f"✨ Here's what I found for \"{message}\":\n"]
    for item in results[:5]:  # limit to top 5 results
        reply_lines.append(
            f"📍 {item['name']} ({item.get('price', '')})\n"
            f"   Category: {item['category'].title()} • Location: {item['location'].title()}\n"
            f"   🔗 View on Web: {BASE_WEB_URL}/?exp={item['id']}\n"
        )

    reply_lines.append(
        f"🌐 Explore all 50+ Accra Escapes: {BASE_WEB_URL}\n"
        "💬 WhatsApp Support: https://wa.me/233559184383"
    )

    await update.message.reply_text("\n".join(reply_lines))


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
    logger.error("Update %s caused error: %s", update, context.error)

    if isinstance(update, Update) and update.effective_message:
        await update.effective_message.reply_text(
            "⚠️ Something went wrong on my end. Please try again in a moment."
        )


def main():
    if not TOKEN:
        raise ValueError(
            "TELEGRAM_BOT_TOKEN is missing from .env"
        )

    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("webapp", webapp_command))
    app.add_handler(CommandHandler("landing", landing_command))
    app.add_handler(CommandHandler("wheel", wheel_command))
    app.add_handler(CommandHandler("map", map_command))
    app.add_handler(
        MessageHandler(
            filters.TEXT & ~filters.COMMAND,
            message_handler
        )
    )
    app.add_error_handler(error_handler)

    print("Micro Escapes bot is running...")
    print("Telegram: @micro_escapebot")

    app.run_polling()


if __name__ == "__main__":
    main()