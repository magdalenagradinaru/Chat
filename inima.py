import math
from turtle import *

def inimaa(k):
    return 15*math.sin(k)**3

def inimab(k):
    return 12*math.cos(k)-5*\
    math.cos(2*k)-2*\
    math.cos(3*k)-\
    math.cos(4*k)
speed(9000)
bgcolor("black")

for i in range(6000):
    goto(inimaa(i)*20, inimab(i)*20)
    for j in range(5):
        color("red")
    goto(0,0)

done()