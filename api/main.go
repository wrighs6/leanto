package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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
		result, err := tasks.InsertOne(context.TODO(), newTask)
		if err != nil {
			panic(err)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]primitive.ObjectID{"id": result.InsertedID.(primitive.ObjectID)})
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
		var providedTeam PartialTeam
		err := decoder.Decode(&providedTeam)
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": bson.M{"$in": providedTeam.Members}}
		opts := options.Find().SetProjection(bson.D{{"_id", 1}, {"name", 1}})
		cursor, err := users.Find(context.TODO(), filter, opts)
		if err != nil {
			panic(err)
		}
		var results []NameIDPair
		if err = cursor.All(context.TODO(), &results); err != nil {
			panic(err)
		}

		var newTeam Team
		newTeam.Name = providedTeam.Name
		newTeam.Members = results

		result, err := teams.InsertOne(context.TODO(), newTeam)
		if err != nil {
			panic(err)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]primitive.ObjectID{"id": result.InsertedID.(primitive.ObjectID)})
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
		var providedUser PartialUser
		err := decoder.Decode(&providedUser)
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": bson.M{"$in": providedUser.Teams}}
		opts := options.Find().SetProjection(bson.D{{"_id", 1}, {"name", 1}})
		cursor, err := teams.Find(context.TODO(), filter, opts)
		if err != nil {
			panic(err)
		}
		var results []NameIDPair
		if err = cursor.All(context.TODO(), &results); err != nil {
			panic(err)
		}

		var newUser User
		newUser.Name = providedUser.Name
		newUser.Teams = results

		result, err := users.InsertOne(context.TODO(), newUser)
		if err != nil {
			panic(err)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]primitive.ObjectID{"id": result.InsertedID.(primitive.ObjectID)})
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

	if err := http.ListenAndServe(":80", mux); err != nil {
		log.Fatal(err)
	}
}
