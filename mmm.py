import math
from turtle import *

def inima1(k):
    return 15*math.sin(k)**3

def inima2(k):
    return 12*math.cos(k)-5*\
    math.cos(2*k)-2*\
    math.cos(3*k)-\
    math.cos(4*k)
bgcolor("black")
speed(9000)

for i in range(6000):
    goto(20*inima1(i), 20*inima2(i))
    for j in range(5):
        color("red")
    goto(0,0)
done()
