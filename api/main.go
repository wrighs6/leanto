package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Create a new client and connect to the db container
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("DB_CONN")))
	if err != nil {
		panic(err)
	}

	// Send a ping to confirm a successful connection
	var result bson.M
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Decode(&result); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

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
