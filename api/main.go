package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]string{"Team 1", "Team 2", "Team 3"})
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		if r.Method != "GET" {
			http.Error(w, "method is not supported", http.StatusNotFound)
			return
		}
	})

	if err := http.ListenAndServe(":80", mux); err != nil {
		log.Fatal(err)
	}
}
