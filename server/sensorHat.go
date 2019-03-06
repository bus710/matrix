package main

import (
	"log"
	"sync"
	"time"
)

type sensorHat struct {
	wait          *sync.WaitGroup
	chanStop      chan bool
	chanDataReady chan bool
}

func (sh *sensorHat) init(wait *sync.WaitGroup) {
	log.Println()
	sh.chanStop = make(chan bool, 1)
	sh.chanDataReady = make(chan bool, 1)
	sh.wait = wait
}

func (sh *sensorHat) run() {
	tick := time.Tick(1000 * time.Millisecond)

StopFlag:
	for {
		select {
		case <-sh.chanStop:
			// To shutdown gracefully.
			// Some cleaning action can be added here.
			log.Println("got a signal from the chanStop")
			break StopFlag
		case <-sh.chanDataReady:
			log.Println("data ready")
		case <-tick:
			log.Println("test from the sensorhat routine")
		default:
		}
	}
	sh.wait.Done()
}
