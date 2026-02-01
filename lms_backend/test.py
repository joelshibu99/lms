from google import genai

client = genai.Client(api_key="AIzaSyBo0GspbsFLXG7TjMFulbEkfPV3nuqKyu8")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Say hello in one sentence"
)

print(response.text)
