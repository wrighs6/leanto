package main

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NameIDPair struct {
  Name string `json:"name"`
  ID primitive.ObjectID `json:"id" bson:"_id"`
}

// Holds the different teams
type Team struct {
	ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name    string   `json:"name"`
	Members []NameIDPair `json:"members"`
}

// A modified Team struct in the format provided by the client
type PartialTeam struct {
	Name    string   `json:"name"`
	Members []primitive.ObjectID `json:"members"`
}

// Holds the different tasks/files from the user
type Task struct {
	ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Team NameIDPair `json:"team,omitempty"`
	AssignedTo  []NameIDPair `json:"assignedTo"`
	DueDate time.Time `json:"dueDate"`
	Priority    string   `json:"priority"`
	Status      string   `json:"status"`
}

// A modified Task struct in the format provided by the client
type PartialTask struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Team primitive.ObjectID `json:"team"`
	AssignedTo  []primitive.ObjectID `json:"assignedTo"`
	DueDate time.Time `json:"dueDate"`
	Priority    string   `json:"priority"`
	Status      string   `json:"status"`
}

// Holds the information of users
type User struct {
	ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name  string   `json:"name"`
	Teams []NameIDPair `json:"teams"`
}

// A modified User struct in the format provided by the client
type PartialUser struct {
	Name  string   `json:"name"`
	Teams []primitive.ObjectID `json:"teams"`
}
