"""Knowledge-base retrieval API for citizen disposal questions."""
import json
import re
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent.parent
KB_PATH = BASE_DIR / "knowledge_base" / "waste_info.json"
router = APIRouter(prefix="/api/v1/assistant", tags=["Citizen AI Assistant"])


class AssistantQuestion(BaseModel):
    question: str = Field(min_length=2, max_length=500)


def tokens(value: str) -> set[str]:
    words = set()
    for word in re.findall(r"[a-z0-9]+", value.lower()):
        if len(word) > 2:
            words.add(word)
            if word.endswith("ies"):
                words.add(word[:-3] + "y")
            elif word.endswith("s") and not word.endswith("ss"):
                words.add(word[:-1])
    return words

@router.post("/ask")
def ask_assistant(payload: AssistantQuestion):
    """Retrieve disposal guidance from the project's curated waste knowledge base."""
    knowledge = json.loads(KB_PATH.read_text(encoding="utf-8"))
    query_tokens = tokens(payload.question)
    
    ranked = []
    for name, info in knowledge.items():
        name_tokens = tokens(name)
        # Score is based on intersection with name
        score = len(query_tokens & name_tokens) * 2
        
        # Add points if name is literally in the question
        if name in payload.question.lower():
            score += 5
            
        # Add points for matching description or category words
        desc_tokens = tokens(info.get("description", "")) | tokens(info.get("category", ""))
        score += len(query_tokens & desc_tokens) * 0.5
        
        ranked.append((score, name, info))
        
    ranked.sort(reverse=True, key=lambda x: x[0])
    score, item, info = ranked[0]
    if score == 0:
        return {
            "answer": "I could not match that item to our disposal guide. Keep hazardous items and electronics out of regular bins, and check your local recycling authority for confirmation.",
            "sources": [],
            "matched": False,
        }
    tips = " ".join(info.get("tips", []))
    answer = f"{item.title()} is {info.get('category', 'a waste item')}. Use the {info.get('bin', 'appropriate')} bin. {info.get('description', '')} {tips}".strip()
    return {"answer": answer, "sources": [item], "matched": True}
