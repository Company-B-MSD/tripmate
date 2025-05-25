# rag_setup.py
import os
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
import os
os.environ["USER_AGENT"] = "Mozilla/5.0 (compatible; MyBot/1.0; +http://example.com/bot)"


# Initialize embedding model
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# List of Sri Lanka travel-related URLs
urls = [
    "https://www.viator.com/Sri-Lanka-tours/Day-Trips-and-Excursions/d19-g5",
    "https://www.srilankadaytours.com/",
    "https://www.tripadvisor.com/Attractions-g293962-Activities-c63-Colombo_Western_Province.html",
    "https://www.tripssrilanka.com/",
    "https://www.intrepidtravel.com/en/sri-lanka",
    "https://www.tourradar.com/d/sri-lanka",
    "https://www.getyourguide.com/sri-lanka-l169048/",
    "https://www.tuimusement.com/us/sri-lanka/c_162/",
    "https://www.exodustravels.com/destinations/asia-holidays/sri-lanka-holidays",
    "https://weligamacabs.lk/",
    "https://www.marriott.com/offers/rest-relax-be-rewarded-with-5-off-all-stays-off-153025",
    "https://www.exodustravels.com/trips/sri-lanka-holidays/culture/sri-lankan-highlights/aia",
    "https://www.kimkim.com/sc/sri-lanka-tours",
    "https://www.withlocals.com/experiences/sri-lanka/tours/day-trips/",
    "https://www.makemytrip.com/holidays-international/sri_lanka-vacation-tour-packages.html",
    "https://www.srilanka.travel/",
    "https://www.klook.com/experiences/list/sri-lanka-day-trips/g53-cate10/",
    "https://www.holidify.com/country/sri-lanka/places-to-visit.html",
    "https://www.civitatis.com/en/sri-lanka/",
    "https://www.onthegotours.com/Sri-Lanka",
    "https://www.onetravel.com/booknow/flights/flights-under-99",
    "https://www.beyondescapes.com/day-tours",
    "https://www.bestoflanka.com/",
    "https://www.intrepidtravel.com/en/sri-lanka/best-sri-lanka-160367",
    "https://www.lonelyplanet.com/destinations/sri-lanka",
    "https://www.srilankanexpeditions.lk/",
    "https://www.tripadvisor.com/Tourism-g293961-Sri_Lanka-Vacations.html",
    "https://www.gadventures.com/destinations/asia/sri-lanka/",
    "https://www.olankatravels.com/destinations/sri-lanka/"
]

# Load documents
loader = WebBaseLoader(urls)
docs = loader.load()

# Split documents into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(docs)

# Create vector database
vectorstore = FAISS.from_documents(chunks, embedding_model)
vectorstore.save_local("travel_vectorstore")

print("✅ Vector store created and saved locally.")
