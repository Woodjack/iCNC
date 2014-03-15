import time
import stepper

class cnc:

	def __init__(self):
		self.motor = 0 
        self.awake = 0
        self.stepPin = 0
        self.dirPin = 0
        self.speed = .0001 #default stepping wait time
        self.position = 0