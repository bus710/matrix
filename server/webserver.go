package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/tidwall/gjson"
	"golang.org/x/net/websocket"
)

type webServer struct {
	instance       *http.Server
	responseItem   *Item
	receivedItemWS *Message
	responseItemWS *Message
}

// Item - This can be used for the REST API response to the clients
type Item struct {
	ID      string `json:"id,omitempty"`
	Content string `json:"content,omitempty"`
}

// Message - This can be used for the websocket response to the clients
type Message struct {
	Message string `json:"message"`
}

// Matrix - This can be used to store the incoming RGB matrix value
type Matrix struct {
	Meta string `json:"meta,omitempty"`
	R64  string `json:"r64,omitempty"`
	G64  string `json:"g64,omitempty"`
	B64  string `json:"b64,omitempty"`
}

func (s *webServer) init() {
	item := make([]Item, 0)
	item = append(item, Item{ID: "1", Content: "1"})
	item = append(item, Item{ID: "2", Content: "2"})

	s.instance = &http.Server{Addr: ":8080"}
}

func (s *webServer) run() {
	// Rest APIs
	router := mux.NewRouter()
	router.HandleFunc("/api", s.GetItem).Methods("GET")
	router.HandleFunc("/api", s.PostItem).Methods("POST")
	http.Handle("/api", router)

	// WebSocket
	http.Handle("/message", websocket.Handler(s.socket))

	// Web Contents
	http.Handle("/", http.FileServer(http.Dir("./public")))
	s.instance.ListenAndServe()
}

// GetItem ...
func (s *webServer) GetItem(w http.ResponseWriter, r *http.Request) {
	log.Println("GET is requested")
	json.NewEncoder(w).Encode(s.responseItem)
}

// PostItem ...
func (s *webServer) PostItem(w http.ResponseWriter, r *http.Request) {
	log.Println("POST is requested")

	var matrix Matrix

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

/* ========================================= */

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

		log.Println("Received message:", s.receivedItemWS)

		// send a response
		s.responseItemWS = &Message{"Thanks for the message!"}
		if err := websocket.JSON.Send(ws, s.responseItemWS); err != nil {
			log.Println(err)
			break
		}
	}
}

/* ========================================= */
