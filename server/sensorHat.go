package main

import (
	"log"
	"sync"
	"time"
)

type sensorHat struct {
	chanStop chan bool
	wait     *sync.WaitGroup
}

func (sh *sensorHat) init(wait *sync.WaitGroup) {
	log.Println()
	sh.chanStop = make(chan bool, 1)
	sh.wait = wait
}

func (sh *sensorHat) run() {
	tick := time.Tick(1000 * time.Millisecond)

StopFlag:
	for {
		select {
		case <-sh.chanStop:
			log.Println("got a signal from the chanStop")
			break StopFlag
		case <-tick:
			log.Println("test from the sensorhat routine")
		default:
		}
	}
	sh.wait.Done()
}
