#rule_based_module.py:

import torch
import json
import random
from .nltk_utils import tokenize, bag_of_words
from .model import NeuralNet

# Încărcăm intențiile din fișierul JSON
with open('chatbot_backend/data/intents.json', 'r') as f:
    intents = json.load(f)

# Încarcă modelul antrenat
def load_model():
    FILE = "chatbot_backend/data.pth"
    data = torch.load(FILE, weights_only=True)

    input_size = data["input_size"]
    hidden_size = data["hidden_size"]
    output_size = data["output_size"]
    all_words = data['all_words']
    tags = data['tags']
    model_state = data["model_state"]

    model = NeuralNet(input_size, hidden_size, output_size)
    model.load_state_dict(model_state)
    model.eval()

    return model, all_words, tags
def get_rule_based_response(user_input):
    try:
        model, all_words, tags = load_model()

        # Tokenizare și transformare în "bag of words"
        tokenized_input = tokenize(user_input)
        input_vector = bag_of_words(tokenized_input, all_words)
        input_vector = torch.from_numpy(input_vector.reshape(1, -1))

        # Predicția cu modelul
        output = model(input_vector)
        _, predicted_class = torch.max(output, dim=1)
        tag = tags[predicted_class.item()]

        # Probabilitatea predicției
        probs = torch.softmax(output, dim=1)
        prob = probs[0][predicted_class.item()]

        # Dacă probabilitatea este suficient de mare, răspunsul bazat pe reguli este returnat
        if prob.item() > 0.75:
            for intent in intents['intents']:
                if tag == intent["tag"]:
                    return random.choice(intent['responses'])

        return None

    except Exception as e:
        print(f"Error in get_rule_based_response: {str(e)}")
        return None
