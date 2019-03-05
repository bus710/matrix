package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/tidwall/gjson"
	"golang.org/x/net/websocket"
	"rsc.io/quote"
)

// Item ...
type Item struct {
	ID      string `json:"id,omitempty"`
	Content string `json:"content,omitempty"`
}

// Matrix ...
type Matrix struct {
	Meta string `json:"meta,omitempty"`
	R64  string `json:"r64,omitempty"`
	G64  string `json:"g64,omitempty"`
	B64  string `json:"b64,omitempty"`
}

var item []Item

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

// GetItem ...
func GetItem(w http.ResponseWriter, r *http.Request) {
	log.Println("GET is requested")
	json.NewEncoder(w).Encode(item)
}

// PostItem ...
func PostItem(w http.ResponseWriter, r *http.Request) {
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

	json.NewEncoder(w).Encode(item)
}

type message struct {
	Message string `json:"message"`
}

func socket(ws *websocket.Conn) {
	log.Println(ws.Request().RemoteAddr)

	defer ws.Close()

	for {
		var m message
		// receive a message using the codec
		if err := websocket.JSON.Receive(ws, &m); err != nil {
			log.Println(err)
			break
		}

		log.Println("Received message:", m.Message)

		// send a response
		m2 := message{"Thanks for the message!"}
		if err := websocket.JSON.Send(ws, m2); err != nil {
			log.Println(err)
			break
		}
	}
}
