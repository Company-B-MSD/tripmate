import com.google.ai.client.generativeai.GenerativeModel;
import com.google.ai.client.generativeai.type.Content;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ChatbotService {
    private final GenerativeModel model;

    public ChatbotService(@Value("${GOOGLE_API_KEY}") String apiKey) {
        this.model = new GenerativeModel("gemini-1.5-pro", apiKey);
    }

    public String getResponse(String userInput) {
        try {
            Content content = model.generateContent("As Tripmate travel assistant: " + userInput);
            return content.getText();
        } catch (Exception e) {
            // Log the exception and return a fallback response
            System.err.println("Error generating content: " + e.getMessage());
            return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
        }
    }
}