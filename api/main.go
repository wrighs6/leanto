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
		NilMapAsEmpty: true,
		NilSliceAsEmpty: true,
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
		var providedTask PartialTask
		err := decoder.Decode(&providedTask)
		if err != nil {
			panic(err)
		}

		teamFilter := bson.M{"_id": providedTask.Team}
		teamOpts := options.FindOne().SetProjection(bson.D{{"_id", 1}, {"name", 1}})
		var teamResult NameIDPair
		err = teams.FindOne(context.TODO(), teamFilter, teamOpts).Decode(&teamResult)
		if err != nil {
			if err != mongo.ErrNoDocuments {
				panic(err)
			}
		}

		atFilter := bson.M{"_id": bson.M{"$in": providedTask.AssignedTo}}
		atOpts := options.Find().SetProjection(bson.D{{"_id", 1}, {"name", 1}})
		cursor, err := users.Find(context.TODO(), atFilter, atOpts)
		if err != nil {
			panic(err)
		}
		var atResults []NameIDPair
		if err = cursor.All(context.TODO(), &atResults); err != nil {
			panic(err)
		}

		var newTask Task
		newTask.Name = providedTask.Name
		newTask.Description = providedTask.Description
		newTask.Team = teamResult
		newTask.AssignedTo = atResults
		newTask.DueDate = providedTask.DueDate
		newTask.Priority = providedTask.Priority
		newTask.Status = providedTask.Status

		result, err := tasks.InsertOne(context.TODO(), newTask)
		if err != nil {
			panic(err)
		}
		newTask.ID = result.InsertedID.(primitive.ObjectID)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(bson.M{"id": newTask.ID})
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

	mux.HandleFunc("GET /tasks/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": id}
		opts := options.FindOne()

		var result Task
		err = tasks.FindOne(context.TODO(), filter, opts).Decode(&result)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				w.WriteHeader(http.StatusNotFound)
				return
			} else {
				panic(err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	})

	mux.HandleFunc("DELETE /tasks/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": id}

		result, err := tasks.DeleteOne(context.TODO(), filter)
		if err != nil {
			panic(err)
		}

		if result.DeletedCount == 0 {
			w.WriteHeader(http.StatusNotFound)
		} else {
			w.WriteHeader(http.StatusNoContent)
		}
	})

	mux.HandleFunc("PUT /tasks/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": id}

		decoder := json.NewDecoder(r.Body)
		var providedTask PartialTask
		err = decoder.Decode(&providedTask)
		if err != nil {
			panic(err)
		}

		teamFilter := bson.M{"_id": providedTask.Team}
		teamOpts := options.FindOne().SetProjection(bson.D{{"_id", 1}, {"name", 1}})
		var teamResult NameIDPair
		err = teams.FindOne(context.TODO(), teamFilter, teamOpts).Decode(&teamResult)
		if err != nil {
			panic(err)
		}

		atFilter := bson.M{"_id": bson.M{"$in": providedTask.AssignedTo}}
		atOpts := options.Find().SetProjection(bson.D{{"_id", 1}, {"name", 1}})
		cursor, err := users.Find(context.TODO(), atFilter, atOpts)
		if err != nil {
			panic(err)
		}
		var atResults []NameIDPair
		if err = cursor.All(context.TODO(), &atResults); err != nil {
			panic(err)
		}

		var newTask Task
		newTask.Name = providedTask.Name
		newTask.Description = providedTask.Description
		newTask.Team = teamResult
		newTask.AssignedTo = atResults
		newTask.DueDate = providedTask.DueDate
		newTask.Priority = providedTask.Priority
		newTask.Status = providedTask.Status

		_, err = tasks.ReplaceOne(context.TODO(), filter, newTask)
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusNoContent)
	})

	mux.HandleFunc("DELETE /tasks", func(w http.ResponseWriter, r *http.Request) {
		_, err := tasks.DeleteMany(context.TODO(), bson.D{})
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusNoContent)
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
		newTeam.ID = result.InsertedID.(primitive.ObjectID)

		update := bson.M{"$push": bson.M{"teams": NameIDPair{newTeam.Name, newTeam.ID}}}
		_, err = users.UpdateMany(context.TODO(), filter, update)
		if err != nil {
			panic(err)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(bson.M{"id": newTeam.ID})
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

	mux.HandleFunc("GET /teams/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": id}
		opts := options.FindOne()

		var result Team
		err = teams.FindOne(context.TODO(), filter, opts).Decode(&result)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				w.WriteHeader(http.StatusNotFound)
				return
			} else {
				panic(err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	})

	mux.HandleFunc("DELETE /teams/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": id}
		
		var deleted Team
		opts := options.FindOne()
		err = teams.FindOne(context.TODO(), filter, opts).Decode(&deleted)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				w.WriteHeader(http.StatusNotFound)
				return
			} else {
				panic(err)
			}
		}

		_, err = teams.DeleteOne(context.TODO(), filter)
		if err != nil {
			panic(err)
		}

		memberIDs := make([]primitive.ObjectID, len(deleted.Members))
		for i, mem := range deleted.Members {
			memberIDs[i] = mem.ID
		}

		membersFilter := bson.M{"_id": bson.M{"$in": memberIDs}}
		update := bson.M{"$pull": bson.M{"teams": NameIDPair{deleted.Name, deleted.ID}}}
		_, err = users.UpdateMany(context.TODO(), membersFilter, update)
		if err != nil {
			panic(err)
		}

		w.WriteHeader(http.StatusNoContent)
	})

	mux.HandleFunc("PUT /teams/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": id}

		decoder := json.NewDecoder(r.Body)
		var providedTeam PartialTeam
		err = decoder.Decode(&providedTeam)
		if err != nil {
			panic(err)
		}

		membersFilter := bson.M{"_id": bson.M{"$in": providedTeam.Members}}
		opts := options.Find().SetProjection(bson.D{{"_id", 1}, {"name", 1}})
		cursor, err := users.Find(context.TODO(), membersFilter, opts)
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

		_, err = teams.ReplaceOne(context.TODO(), filter, newTeam)
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusNoContent)
	})

	mux.HandleFunc("DELETE /teams", func(w http.ResponseWriter, r *http.Request) {
		_, err := teams.DeleteMany(context.TODO(), bson.D{})
		if err != nil {
			panic(err)
		}

		update := bson.M{"$set": bson.M{"teams": []NameIDPair{}}}
		_, err = users.UpdateMany(context.TODO(), bson.D{}, update)
		if err != nil {
			panic(err)
		}

		w.WriteHeader(http.StatusNoContent)
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
		newUser.ID = result.InsertedID.(primitive.ObjectID)

		update := bson.M{"$push": bson.M{"members": NameIDPair{newUser.Name, newUser.ID}}}
		_, err = teams.UpdateMany(context.TODO(), filter, update)
		if err != nil {
			panic(err)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(bson.M{"id": newUser.ID})
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

	mux.HandleFunc("GET /users/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": id}
		opts := options.FindOne()

		var result User
		err = users.FindOne(context.TODO(), filter, opts).Decode(&result)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				w.WriteHeader(http.StatusNotFound)
				return
			} else {
				panic(err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	})

	mux.HandleFunc("DELETE /users/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": id}

		var deleted User
		opts := options.FindOne()
		err = users.FindOne(context.TODO(), filter, opts).Decode(&deleted)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				w.WriteHeader(http.StatusNotFound)
				return
			} else {
				panic(err)
			}
		}

		_, err = users.DeleteOne(context.TODO(), filter)
		if err != nil {
			panic(err)
		}

		teamIDs := make([]primitive.ObjectID, len(deleted.Teams))
		for i, t := range deleted.Teams {
			teamIDs[i] = t.ID
		}

		teamsFilter := bson.M{"_id": bson.M{"$in": teamIDs}}
		update := bson.M{"$pull": bson.M{"members": NameIDPair{deleted.Name, deleted.ID}}}
		_, err = teams.UpdateMany(context.TODO(), teamsFilter, update)
		if err != nil {
			panic(err)
		}

		w.WriteHeader(http.StatusNoContent)
	})

	mux.HandleFunc("PUT /users/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
		if err != nil {
			panic(err)
		}

		filter := bson.M{"_id": id}

		decoder := json.NewDecoder(r.Body)
		var providedUser PartialUser
		err = decoder.Decode(&providedUser)
		if err != nil {
			panic(err)
		}

		teamsFilter := bson.M{"_id": bson.M{"$in": providedUser.Teams}}
		opts := options.Find().SetProjection(bson.D{{"_id", 1}, {"name", 1}})
		cursor, err := teams.Find(context.TODO(), teamsFilter, opts)
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

		_, err = users.ReplaceOne(context.TODO(), filter, newUser)
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusNoContent)
	})

	mux.HandleFunc("DELETE /users", func(w http.ResponseWriter, r *http.Request) {
		_, err := users.DeleteMany(context.TODO(), bson.D{})
		if err != nil {
			panic(err)
		}

		update := bson.M{"$set": bson.M{"members": []NameIDPair{}}}
		_, err = teams.UpdateMany(context.TODO(), bson.D{}, update)
		if err != nil {
			panic(err)
		}

		w.WriteHeader(http.StatusNoContent)
	})

	handler := CORSMiddleware(mux)

	if err := http.ListenAndServe(":80", handler); err != nil {
		log.Fatal(err)
	}
}
