package main

import (
	"log"
	"sync"

	"rsc.io/quote"
)

func main() {
	log.Println(quote.Hello())

	// Declaring each struct
	waitInstance := sync.WaitGroup{}
	serverInstance := webserver{}
	signalInstance := termSignal{}

	// Initializing each module
	serverInstance.init()
	signalInstance.init(&waitInstance, &serverInstance)

	// Increasing the wait group and starting each go routine
	waitInstance.Add(1)
	go signalInstance.catcher()

	// Running the webserver
	serverInstance.run()
}
