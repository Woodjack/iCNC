

class stepper:

	def __init__(self):

		##Pins
        self.dirPin = 0
        self.stepPin = 0
        self.enablePin = 0

        self.micro5Pin = 0
        self.micro6Pin = 0
        self.micro7Pin = 0
        self.micro8Pin = 0

        self.current1Pin = 0
        self.current2Pin = 0
        self.current3Pin = 0
        ##

        ##variables
        self.axis = "none"
        self.current = 0
        self.microStep = 1
        self.diection = 0
        self.position = 0

#Function called in updateStepping to simpify the pin setting
    def updateSteppingGPIO(self, pin5, pin6, pin7, pin8 ):
    	    self.micro5Pin = pin5
        	self.micro6Pin = pin6
        	self.micro7Pin = pin7
        	self.micro8Pin = pin8

    def updateStepping(self, newStepping):
    	if newStepping == 1:
    		self.microStep = 1
    		updateStepping(0,0,0,0)
    	elif newStepping == 2:
    		self.microStep = 2
    		updateStepping(1,1,1,1)
    	elif newStepping == 4:
    		self.microStep = 4
    		updateStepping(1,0,1,1)
    	elif newStepping == 8:
    		self.microStep = 8
    		updateStepping(1,1,0,1)
    	elif newStepping == 16:
    		self.microStep = 16
    		updateStepping(1,0,0,1)
    	elif newStepping == 32:
    		self.microStep = 32
    		updateStepping(1,1,1,0)
    	elif newStepping == 64:
    		self.microStep = 64
    		updateStepping(1,0,1,0)
    	elif newStepping == 128:
    		self.microStep = 128
    		updateStepping(1,1,0,0)
    	elif newStepping == 256:
    		self.microStep = 256
    		updateStepping(1,1,1,1)
    	elif newStepping == 5:
    		self.microStep = 5
    		updateStepping(0,1,1,1)
    	elif newStepping == 50:
    		self.microStep = 50
    		updateStepping(0,0,0,1)
    	elif newStepping == 125:
    		self.microStep = 125
    		updateStepping(0,1,1,0)
    	elif newStepping == 250:
    		self.microStep = 250
    		updateStepping(0,0,1,0)


    def updateCurrentGPIO(self, sw1, sw2, sw3):
    	##Set gpio values using these inputs

    def updateCurrent(self, newCurrent):
    	self.current = newCurrent
    	if newCurrent == "2.6":
    		updateCurrentGPIO(1,1,1)
    	elif newCurrent == "3.2":
    		updateCurrentGPIO(0,1,1)
    	elif newCurrent == "3.8":
    		updateCurrentGPIO(1,0,1)
    	elif newCurrent == "4.4":
    		updateCurrentGPIO(0,0,1)
    	elif newCurrent == "5.1":
    		updateCurrentGPIO(1,1,0)
    	elif newCurrent == "5.8":
    		updateCurrentGPIO(0,1,0)
    	elif newCurrent == "6.5":
    		updateCurrentGPIO(1,0,0)
    	elif newCurrent == "7.2":
    		updateCurrentGPIO(0,0,0)

    def step(self):

    def updateDirection(self, newDireciton):
    	
    def updatePosition(self, newPosition):


