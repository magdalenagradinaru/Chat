import graphviz

# Creare graf DFA folosind Graphviz
dfa = graphviz.Digraph(format='png')
dfa.attr(rankdir='LR', size='12')

# Definirea stărilor, inclusiv stările finale
states = ['q0', 'q1', 'q2', 'q3', 'q1q3', 'q0q2', 'q1q2', 'q0q1q2q3']
final_states = ['q3', 'q1q3', 'q1q2', 'q0q1q2q3']

# Adăugare stări în graf
for state in states:
    if state in final_states:
        dfa.node(state, shape='doublecircle')
    else:
        dfa.node(state)

# Tranziții pe baza tabelului dat
transitions = [
    ('q0', 'q1', 'a'),
    ('q1', 'q2', 'a'),
    ('q1', 'q1q3', 'b'),
    ('q2', 'q0q2', 'a'),
    ('q2', 'q0q2', 'b'),
    ('q2', 'q2', 'c'),
    ('q3', 'q1', 'b'),
    ('q3', 'q3', 'c'),
    ('q1q3', 'q2', 'a'),
    ('q1q3', 'q1q3', 'b'),
    ('q1q3', 'q3', 'c'),
    ('q0q2', 'q1q2', 'a'),
    ('q0q2', 'q0q2', 'b'),
    ('q0q2', 'q2', 'c'),
    ('q1q2', 'q2', 'a'),
    ('q1q2', 'q0q1q1q3', 'b'),
    ('q1q2', 'q2', 'c'),
    ('q0q1q2q3', 'q1q2', 'a'),
    ('q0q1q2q3', 'q0q1q2q3', 'b'),
    ('q0q1q2q3', 'q2q3', 'c')
]

# Adăugare tranziții în graf
for src, dest, label in transitions:
    dfa.edge(src, dest, label)

# Generare și afișare diagramă
dfa_file = '/mnt/data/dfa_diagram'
dfa.render(dfa_file)
dfa_file += '.png'
dfa_file
