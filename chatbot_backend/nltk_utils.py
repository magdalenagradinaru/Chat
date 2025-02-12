#nltk_utils.py:

import nltk                                     # Natural Language Toolkit
import numpy as np                              # Bibliotecă de manipulare a matricelor și vectorilor
from nltk.stem.porter import PorterStemmer      # Reduce cuvintele la baza lor

# Obiectul ce obține baza cuvintelor
stemmer = PorterStemmer()

# Funcție care împarte textul în cuvinte
def tokenize(sentence):
    return nltk.word_tokenize(sentence)

# Transformă cuvântul în minuscule, apoi obține baza
def stem(word):
    return stemmer.stem(word.lower())

# Funcție care caută cuvinte specifice
def bag_of_words(tokenized_sentence, words):
    # caută baza fiecărui cuvânt
    sentence_words = [stem(w) for w in tokenized_sentence]

    # vector = nr de cuvinte din listă
    bag = np.zeros(len(words), dtype=np.float32)

    # verifică prezența cuvântului în propoziție
    for idx, w in enumerate(words):
        if w in sentence_words:
            bag[idx] = 1.0
    return bag
