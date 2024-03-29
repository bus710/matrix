/* About termSignal.go
This module mainly offers a way to gracefully shutdown the app
when there is a keyboard interrupt to kill the app.
This is important because the app should do these tasks:
- turns off the LEDs on the HAT
- notifies the client to show if the server is shutdown
- stores the last data to the disk (file or DB) */

package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

// termSignal - the main struct of this module
type termSignal struct {
	// app-wide items
	wait     *sync.WaitGroup
	server   *webServer
	senseHat *senseHat
	sigterm  chan os.Signal
}

// init - takes a WG, instance of service, and channels of go routines
// and keeps the assigned params in its struct to access later.
func (sig *termSignal) init(
	wait *sync.WaitGroup,
	serverInstance *webServer,
	senseHatInstance *senseHat) {

	// To assign instances to the pointers
	sig.wait = wait
	sig.server = serverInstance
	sig.senseHat = senseHatInstance
}

// catcher - a handler to catch the interrupts from keyboard (CTRL+C)
// and gracefully shuts down.
func (sig *termSignal) catcher() {
	// To store the unbuffered channel in its struct.
	sig.sigterm = make(chan os.Signal, 1)
	// To connect the keyboard signal to the channel.
	signal.Notify(sig.sigterm, syscall.SIGINT, syscall.SIGTERM)

	// To declare a function that can be used running a graceful shutdown.
	cleanup := func() {
		log.Println("Start of the cleanup")

		// To send a signal to the sensorHat's channel
		sig.senseHat.chanStop <- true

		// To call the shutdown method of the webserver
		ctx, cancel := context.WithTimeout(
			context.Background(), time.Millisecond*3000)
		defer cancel()
		if err := sig.server.instance.Shutdown(ctx); err != nil {
			log.Println(err)
		}

		// To decrease the wait group
		sig.wait.Done()

		log.Println("End of the cleanup")
	}

	// The routine waits here for the keyboard interrupt.
	select {
	case received := <-sig.sigterm:
		log.Println()
		log.Println("Received a CTRL+C", received)
		cleanup()
	}
}
