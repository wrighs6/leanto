package main

import (
  "encoding/json"
  "log"
  "net/http"
)

func main() {
  mux := http.NewServeMux()

  tasks := getTasks()
  teams := getTeams()
  users := getUsers()

  mux.HandleFunc("GET /tasks", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(tasks)
  })

  mux.HandleFunc("GET /teams", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(teams)
  })

  mux.HandleFunc("GET /users", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
  })

  if err := http.ListenAndServe(":80", mux); err != nil {
    log.Fatal(err)
  }
}
