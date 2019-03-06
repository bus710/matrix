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

type termSignal struct {
	wait    *sync.WaitGroup
	server  *webServer
	sigterm chan os.Signal
}

// This function takes a WG, instance of service, and channels of go routines
// and keeps the assigned params in its struct to access later.
func (sig *termSignal) init(wait *sync.WaitGroup, serverInstance *webServer) {
	sig.wait = wait
	sig.server = serverInstance
}

// This is a handler to catch the interrupts from keyboard (CTRL+C)
// and gracefully shuts down.
func (sig *termSignal) catcher() {
	// Storing the unbuffered channel in its struct.
	sig.sigterm = make(chan os.Signal, 1)
	// Connecting the keyboard signal to the channel.
	signal.Notify(sig.sigterm, syscall.SIGINT, syscall.SIGTERM)

	// Declaring a function that can be used running a graceful shutdown.
	cleanup := func() {
		log.Println("Start of the cleanup")
		ctx, cancel := context.WithTimeout(
			context.Background(), time.Millisecond*3000)
		defer cancel()
		if err := sig.server.instance.Shutdown(ctx); err != nil {
			log.Println(err)
		}
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
