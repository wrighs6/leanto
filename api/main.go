package main

import (
  "encoding/json"
  "net/http"
)

func main() {
  mux := http.NewServeMux()

  mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode([]string{"Team 1", "Team 2", "Team 3"})
  })

  http.ListenAndServe(":80", mux)
}
