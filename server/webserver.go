package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/tidwall/gjson"
	"golang.org/x/net/websocket"
)

// webServer - the main struct of this module
type webServer struct {
	instance       *http.Server
	responseItem   *Item
	receivedItemWS *Message
	responseItemWS *Message
}

// Item - can be used for the REST API response to the clients
// This is not really used in this example but for future usage.
type Item struct {
	ID      string `json:"id,omitempty"`
	Content string `json:"content,omitempty"`
}

// Message - can be used for the websocket response to the clients
type Message struct {
	Message string `json:"message"`
}

// Matrix - can be used to store the incoming RGB matrix value
type Matrix struct {
	Meta string `json:"meta,omitempty"`
	R64  string `json:"r64,omitempty"`
	G64  string `json:"g64,omitempty"`
	B64  string `json:"b64,omitempty"`
}

// init - initializes the data and structs
func (s *webServer) init() {
	item := make([]Item, 0)
	item = append(item, Item{ID: "1", Content: "1"})
	item = append(item, Item{ID: "2", Content: "2"})

	s.instance = &http.Server{Addr: ":8080"}
}

// run - delivers the static web files and serves the REST API (+ websocket)
func (s *webServer) run() {

	// The router and REST APIs
	router := mux.NewRouter()
	router.HandleFunc("/api", s.GetItem).Methods("GET")
	router.HandleFunc("/api", s.PostItem).Methods("POST")
	http.Handle("/api", router)

	// WebSocket
	http.Handle("/message", websocket.Handler(s.socket))

	// Web Contents
	http.Handle("/", http.FileServer(http.Dir("./public")))

	// Server up and running
	log.Println(s.instance.ListenAndServe())
}

// PostItem - receives a chunk of data from the front-end
// the data should be stored/shared to a file (eventually DB) and the SensorHat's routine
func (s *webServer) PostItem(w http.ResponseWriter, r *http.Request) {
	log.Println("POST is requested")

	// Declaring an instance to store the incoming data
	matrix := Matrix{}

	/* Workaroud when the incoming data's structure is not known */
	// var m interface{}
	// _ = json.NewDecoder(r.Body).Decode(&m)
	// fmt.Println(m)

	/* Although json.unmarshal can be used,
	JSON.stringified string is much easier to handle. */
	_ = json.NewDecoder(r.Body).Decode(&matrix)

	matrixR64 := gjson.Get(matrix.R64, "r64").Array()
	matrixG64 := gjson.Get(matrix.G64, "g64").Array()
	matrixB64 := gjson.Get(matrix.B64, "b64").Array()

	log.Println(matrix.Meta)
	log.Println(matrixR64) // try matrixR64[0].Num
	log.Println(matrixG64)
	log.Println(matrixB64)

	json.NewEncoder(w).Encode(s.responseItem)
}

// GetItem -
func (s *webServer) GetItem(w http.ResponseWriter, r *http.Request) {
	log.Println("GET is requested")
	json.NewEncoder(w).Encode(s.responseItem)
}

// socket - websocket handler
func (s *webServer) socket(ws *websocket.Conn) {
	log.Println(ws.Request().RemoteAddr)

	defer ws.Close()

	for {
		s.receivedItemWS = &Message{}
		// receive a message using the codec
		if err := websocket.JSON.Receive(ws, &s.receivedItemWS); err != nil {
			log.Println(err)
			break
		}

		log.Println("Received message:", s.receivedItemWS.Message)

		// send a response
		s.responseItemWS = &Message{"Thanks for the message!"}
		if err := websocket.JSON.Send(ws, s.responseItemWS); err != nil {
			log.Println(err)
			break
		}
	}
}
