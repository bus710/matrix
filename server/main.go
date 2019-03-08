/* Introduction
This project has been developed to have the minimum code snippet to run these:
- webserver that delivers the static files for mobile browsers, some rest APIs, and websocket
- signal waiter for the keyboard interrupt and gacefully stop the routines
- I2C communication with the sensor hat to drive the LED matrix
- wait group to control the go routines of the signal and I2C */

package main

import (
	"log"
	"sync"
)

// Entry point of the app
func main() {
	log.Println("Hello, world")

	// To declare each struct and getting the pointers
	waitInstance := sync.WaitGroup{}
	senseHatInstance := senseHat{}
	serverInstance := webServer{}
	signalInstance := termSignal{}

	// To initialize each module
	senseHatInstance.init(&waitInstance)
	serverInstance.init(&senseHatInstance)
	signalInstance.init(&waitInstance, &serverInstance, &senseHatInstance)

	// To increase the wait group and starting each go routine
	waitInstance.Add(1)
	go signalInstance.catcher()
	waitInstance.Add(1)
	go senseHatInstance.run()

	// To run the webserver
	serverInstance.run()

	log.Println("See you again")
}
