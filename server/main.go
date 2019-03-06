package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"rsc.io/quote"
)

type termSignal struct {
	wait    *sync.WaitGroup
	server  *webserver
	sigterm chan os.Signal
}

func main() {
	log.Println(quote.Hello())

	var wait sync.WaitGroup
	server := webserver{}
	server.init()

	sig := termSignal{
		wait:   &wait,
		server: &server,
	}

	wait.Add(1)
	go sig.catcher()

	server.run()
}

func (sig *termSignal) catcher() {
	sig.sigterm = make(chan os.Signal, 1)
	signal.Notify(sig.sigterm, syscall.SIGINT, syscall.SIGTERM)

	cleanup := func() {
		ctx, cancel := context.WithTimeout(
			context.Background(), time.Millisecond*3000)
		defer cancel()
		if err := sig.server.instance.Shutdown(ctx); err != nil {
			log.Println(err)
		}
		sig.wait.Done()
	}

	select {
	case received := <-sig.sigterm:
		log.Println("\n>>", received)
		cleanup()
	}
}
