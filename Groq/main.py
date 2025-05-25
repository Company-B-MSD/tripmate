# from fastapi import FastAPI, HTTPException, Request
# from langchain_groq import ChatGroq
# from langchain.chains import RetrievalQA
# from langchain_community.vectorstores import FAISS
# from langchain_huggingface import HuggingFaceEmbeddings

# import os
# from dotenv import load_dotenv
# import os
# os.environ["USER_AGENT"] = "Mozilla/5.0 (compatible; MyBot/1.0; +http://example.com/bot)"


# app = FastAPI()
# load_dotenv()

# # Load GROQ
# api_key = os.getenv("GROQ_API_KEY")
# if not api_key:
#     raise Exception("Missing GROQ_API_KEY")

# # Load LLM
# llm = ChatGroq(model_name="llama-3.3-70b-versatile")

# # Load vector store
# embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
# vectorstore = FAISS.load_local("travel_vectorstore", embedding_model, allow_dangerous_deserialization=True)
# retriever = vectorstore.as_retriever()

# # Combine RAG with LLM
# rag_chain = RetrievalQA.from_chain_type(
#     llm=llm,
#     retriever=retriever,
#     return_source_documents=True
# )

# @app.post("/chat")
# async def chat(request: Request):
#     try:
#         body = await request.json()
#         query = body.get("query")

#         if not query:
#             raise HTTPException(status_code=400, detail="Missing 'query' field in JSON body.")

#         prompt = f"""You are a helpful travel assistant. Always answer based on actual facts from travel websites.

#         Question: {query}
#         """
#         result = rag_chain.invoke({"query": prompt})

#         return {
#             "response": result["result"],
#             #"sources": [doc.metadata.get("source", "") for doc in result["source_documents"]]
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


# main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    # Your chatbot logic here
    return f"You said: {request.message}"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
