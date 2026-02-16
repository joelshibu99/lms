import requests
import logging

logger = logging.getLogger(__name__)


class GeminiServiceError(Exception):
    pass


class GeminiClient:
    """
    Ollama-based local LLM client (FAST + SAFE)
    """

    def __init__(self):
        self.url = "http://localhost:11434/api/generate"
        self.model = "phi3:mini"  # 🔥 USE MINI MODEL (VERY IMPORTANT)

    def generate_text(self, prompt: str) -> str:
        try:
            response = requests.post(
                self.url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_predict": 150,   # 🔥 SHORTER RESPONSE
                        "temperature": 0.7
                    }
                },
                timeout=180,
            )

            response.raise_for_status()
            data = response.json()

            return data.get("response", "").strip()

        except requests.exceptions.Timeout:
            logger.error("Ollama timeout error")
            raise GeminiServiceError("Ollama timeout")

        except requests.exceptions.RequestException as e:
            logger.error(f"Ollama error: {e}")
            raise GeminiServiceError("Ollama service failed")
