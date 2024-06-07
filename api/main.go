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

	mux.HandleFunc("POST /tasks", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var newTask Task
		err := decoder.Decode(&newTask)
		if err != nil {
			panic(err)
		}
		tasks = append(tasks, newTask)
	})

	mux.HandleFunc("GET /tasks", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(tasks)
	})
	mux.HandleFunc("POST /teams", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var newTeam Team
		err := decoder.Decode(&newTeam)
		if err != nil {
			panic(err)
		}
		teams = append(teams, newTeam)
	})

	mux.HandleFunc("GET /teams", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(teams)
	})

	mux.HandleFunc("POST /users", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var newUser User
		err := decoder.Decode(&newUser)
		if err != nil {
			panic(err)
		}
		users = append(users, newUser)
	})

	mux.HandleFunc("GET /users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)
	})

	if err := http.ListenAndServe(":80", mux); err != nil {
		log.Fatal(err)
	}
}
