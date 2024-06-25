package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Specify BSON options that cause the driver to fallback to "json"
	// struct tags if "bson" struct tags are missing, marshal nil Go maps as
	// empty BSON documents, and marshals nil Go slices as empty BSON
	// arrays.
	bsonOpts := &options.BSONOptions{
		UseJSONStructTags: true,
		NilMapAsEmpty:     true,
		NilSliceAsEmpty:   true,
	}

	opts := options.Client().ApplyURI(os.Getenv("DB_CONN")).SetBSONOptions(bsonOpts)

	// Create a new client and connect to the db container
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	tasks := client.Database("leanto").Collection("tasks")
	teams := client.Database("leanto").Collection("teams")
	users := client.Database("leanto").Collection("users")

	mux := http.NewServeMux()

	mux.HandleFunc("POST /tasks", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var newTask Task
		err := decoder.Decode(&newTask)
		if err != nil {
			panic(err)
		}
		_, err = tasks.InsertOne(context.TODO(), newTask)
		if err != nil {
			panic(err)
		}
	})

	mux.HandleFunc("GET /tasks", func(w http.ResponseWriter, r *http.Request) {
		cursor, err := tasks.Find(context.TODO(), bson.D{{}})
		var results []Task
		if err = cursor.All(context.TODO(), &results); err != nil {
			panic(err)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	})

	mux.HandleFunc("POST /teams", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var newTeam Team
		err := decoder.Decode(&newTeam)
		if err != nil {
			panic(err)
		}
		_, err = teams.InsertOne(context.TODO(), newTeam)
		if err != nil {
			panic(err)
		}
	})

	mux.HandleFunc("GET /teams", func(w http.ResponseWriter, r *http.Request) {
		cursor, err := teams.Find(context.TODO(), bson.D{{}})
		var results []Team
		if err = cursor.All(context.TODO(), &results); err != nil {
			panic(err)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	})

	mux.HandleFunc("POST /users", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var newUser User
		err := decoder.Decode(&newUser)
		if err != nil {
			panic(err)
		}
		_, err = users.InsertOne(context.TODO(), newUser)
		if err != nil {
			panic(err)
		}
	})

	mux.HandleFunc("GET /users", func(w http.ResponseWriter, r *http.Request) {
		cursor, err := users.Find(context.TODO(), bson.D{{}})
		var results []User
		if err = cursor.All(context.TODO(), &results); err != nil {
			panic(err)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	})

	handler := CORSMiddleware(mux)

	if err := http.ListenAndServe(":80", handler); err != nil {
		log.Fatal(err)
	}
}
