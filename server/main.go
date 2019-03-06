package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"golang.org/x/net/websocket"
	"rsc.io/quote"
)

func main() {
	log.Println(quote.Hello())

	item = append(item, Item{ID: "1", Content: "1"})
	item = append(item, Item{ID: "2", Content: "2"})

	// Rest APIs
	router := mux.NewRouter()
	router.HandleFunc("/api", GetItem).Methods("GET")
	router.HandleFunc("/api", PostItem).Methods("POST")
	http.Handle("/api", router)

	// WebSocket
	http.Handle("/message", websocket.Handler(socket))

	// Web Contents
	http.Handle("/", http.FileServer(http.Dir("./public")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
