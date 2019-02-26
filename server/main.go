package main

import (
	"fmt"
	"os"

	"github.com/hashicorp/mdns"
	"rsc.io/quote"
)

func main() {
	fmt.Println(quote.Hello())

	host, _ := os.Hostname()
	info := []string{"My awesome service"}
	service, _ := mdns.NewMDNSService(host, "_matrix_server._http", "", "", 8080, nil, info)

	// Create the mDNS server, defer shutdown
	server, _ := mdns.NewServer(&mdns.Config{Zone: service})
	defer server.Shutdown()
	for {

	}
}
