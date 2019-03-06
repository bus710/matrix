package main

import (
	"log"
	"sync"
)

/* Introduction
This project has been developed to have the minimum code snippet to run these:
	- webserver that delivers the static file for browser, some rest APIs, and websocket
	- signal waiter for the keyboard interrupt and gacefully shut the routine down
	- I2C communication with the sensor hat to driver the LED matrix
	- wait group to wait for the signal and I2C routines*/

// Entry point of the app
func main() {
	log.Println("Hello, world")

	// Declaring each struct and getting the pointers
	waitInstance := sync.WaitGroup{}
	sensorHatInstance := sensorHat{}
	serverInstance := webServer{}
	signalInstance := termSignal{}

	// Initializing each module
	sensorHatInstance.init(&waitInstance)
	serverInstance.init(&sensorHatInstance)
	signalInstance.init(&waitInstance, &serverInstance, &sensorHatInstance)

	// Increasing the wait group and starting each go routine
	waitInstance.Add(1)
	go signalInstance.catcher()
	waitInstance.Add(1)
	go sensorHatInstance.run()

	// Running the webserver
	serverInstance.run()

	log.Println("See you again")
}
