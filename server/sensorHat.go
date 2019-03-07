/* About sensorHat.go
This module has been developed to access the HAT (of course...). */

package main

import (
	"log"
	"runtime"
	"strings"
	"sync"
	"time"

	"periph.io/x/periph/conn"
	"periph.io/x/periph/conn/i2c"
	"periph.io/x/periph/conn/i2c/i2creg"
	"periph.io/x/periph/host"
)

// The main struc of this module
type sensorHat struct {
	// local items
	isARM  bool
	i2cBus i2c.BusCloser
	i2cDev i2c.Dev
	i2cCon conn.Conn

	// app-wide itesm
	wait          *sync.WaitGroup
	chanStop      chan bool
	chanDataReady chan bool
}

// init - assigns data and channels
func (sh *sensorHat) init(wait *sync.WaitGroup) {
	log.Println()
	sh.chanStop = make(chan bool, 1)
	sh.chanDataReady = make(chan bool, 1)
	sh.wait = wait

	if strings.Contains(runtime.GOARCH, "ARM") {
		// To make sure the arch afterwords
		sh.isARM = true

		// To initialize the baseline drivers
		_, err := host.Init()
		if err != nil {
			log.Println(err)
		}

		// To open the i2c1 of RPI
		bus, err := i2creg.Open("")
		if err != nil {
			log.Println(err)
		}

		// To initialize i2c bus
		addr := uint16(0x0046)
		sh.i2cBus = bus
		sh.i2cDev = i2c.Dev{Bus: sh.i2cBus, Addr: addr} // To avoid Vet's warning
		sh.i2cCon = &sh.i2cDev
	} else {
		sh.isARM = false
	}
}

// run - runs the main go routine
func (sh *sensorHat) run() {
	tick := time.Tick(1000 * time.Millisecond)

	if sh.isARM {
		defer sh.i2cBus.Close()
	}

StopFlag:
	for {
		select {
		case <-sh.chanStop:
			// To shutdown gracefully.
			// Some cleaning action can be added here.
			log.Println("got a signal from the chanStop")
			break StopFlag
		case <-sh.chanDataReady:
			// When the webserver safely received a chunk of data
			log.Println("data ready")
		case <-tick:
			// To run some task periodically
			log.Println("test from the sensorhat routine")
		default:
		}
	}
	sh.wait.Done()
}
