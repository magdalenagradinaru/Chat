#train.py:

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from chatbot_backend.nltk_utils import tokenize, stem, bag_of_words
from chatbot_backend.model import NeuralNet
import json

# Citim intentiile din fisierul JSON
with open('intents.json', 'r') as f:
    intents = json.load(f)

# Lista cu cuvinte si etichete
all_words = []
tags = []
xy = []

# Iterăm prin intențiile chatbot-ului
for intent in intents['intents']:
    tag = intent['tag']
    tags.append(tag)
    for pattern in intent['patterns']:
        words = tokenize(pattern)
        all_words.extend(words)
        xy.append((words, tag))


# Aplicăm stemming și excludem caracterele speciale
ignore_words = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?','[', '\\', ']', '^', '_', '`',  '{', '|', '}', '~']
all_words = [stem(w) for w in all_words if w not in ignore_words]
all_words = sorted(set(all_words))
tags = sorted(set(tags))

# Creăm seturile de date pentru antrenament
X_train = [bag_of_words(sentence, all_words) for sentence, _ in xy]
y_train = [tags.index(tag) for _, tag in xy]

# Conversie în numpy arrays
X_train = np.array(X_train)
y_train = np.array(y_train)

# Hiperparametrii modelului
batch_size = 8
hidden_size = 8
output_size = len(tags)
input_size = len(X_train[0])
learning_rate = 0.001
num_epochs = 1000

# Dataset personalizat pentru DataLoader
class ChatDataset(Dataset):
    def __init__(self):
        self.n_samples = len(X_train)
        self.x_data = X_train
        self.y_data = y_train

    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    def __len__(self):
        return self.n_samples

# Încărcăm datele folosind DataLoader
dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset, batch_size=batch_size, shuffle=True)

# Instanțiem și antrenăm modelul
model = NeuralNet(input_size, hidden_size, output_size)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

for epoch in range(num_epochs):
    for words, labels in train_loader:
        words = torch.tensor(words, dtype=torch.float32)
        labels = torch.tensor(labels, dtype=torch.long)

        # Forward pass
        outputs = model(words)
        loss = criterion(outputs, labels)

        # Backward pass și optimizare
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    if (epoch + 1) % 100 == 0:
        print(f'Epoch [{epoch + 1}/{num_epochs}], Loss: {loss.item():.4f}')

# Salvăm modelul
data = {
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": tags
}

FILE = "data.pth"
torch.save(data, FILE)
print(f'Training complete. File saved to {FILE}')
