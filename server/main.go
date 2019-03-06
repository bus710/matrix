package main

import (
	"log"

	"rsc.io/quote"
)

func main() {
	log.Println(quote.Hello())

	// var wait sync.WaitGroup

	server := webserver{}
	server.init()
	server.run()

}
