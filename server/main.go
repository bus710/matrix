/* Introduction
This project has been developed to have the minimum code snippet to run these:
- webserver that delivers the static files for mobile browsers, some rest APIs, and websocket
- signal waiter for the keyboard interrupt and gacefully stop the routines
- I2C communication with the sensor hat to drive the LED matrix
- wait group to wait for the signal and I2C routines */

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
	sensorHatInstance := sensorHat{}
	serverInstance := webServer{}
	signalInstance := termSignal{}

	// To initialize each module
	sensorHatInstance.init(&waitInstance)
	serverInstance.init(&sensorHatInstance)
	signalInstance.init(&waitInstance, &serverInstance, &sensorHatInstance)

	// To increase the wait group and starting each go routine
	waitInstance.Add(1)
	go signalInstance.catcher()
	waitInstance.Add(1)
	go sensorHatInstance.run()

	// To run the webserver
	serverInstance.run()

	log.Println("See you again")
}
