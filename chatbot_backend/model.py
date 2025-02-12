#model.py:

# Modul din PyTorch care se ocupă de construirea rețelelor neuronale - nn
import torch.nn as nn

# Clasă moștenită din modulul nn
class NeuralNet(nn.Module):

    # Constructor
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()

        # Definim straturile care mapează dimensounea datelor de intrare, straturile ascunse și datele de ieșire
        self.l1 = nn.Linear(input_size, hidden_size)
        self.l2 = nn.Linear(hidden_size, hidden_size)
        self.l3 = nn.Linear(hidden_size, num_classes)

        # Funcția de activare - introduce neliniaritate
        self.relu = nn.ReLU()

# Metodă care definelște cum datele trec prin rețea și generează ieșirea modelului
    def forward(self, x):
        x = self.relu(self.l1(x))
        x = self.relu(self.l2(x))
        x = self.l3(x)
        return x
