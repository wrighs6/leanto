package main

import "go.mongodb.org/mongo-driver/bson/primitive"

/*
Holds the different teams
*/
type Team struct {
	ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name    string   `json:"name"`
	Members []string `json:"members"`
}

/*
Holds the different tasks/files from the user
*/
type Task struct {
	ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	AssignedTo  []string `json:"assignedTo"`
	Priority    string   `json:"priority"`
	Status      string   `json:"status"`
}

/*
Holds the information of users
*/
type User struct {
	ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name  string   `json:"name"`
	Teams []string `json:"teams"`
}

func getUsers() []User {
	// create some users
	user1 := User{
		Name:  "Stephen Wright",
		Teams: []string{"Team 1"},
	}
	user2 := User{
		Name:  "Dylan Zhou",
		Teams: []string{"Team 1"},
	}
	user3 := User{
		Name:  "User 3",
		Teams: []string{"Team 2"},
	}
	user4 := User{
		Name:  "User 4",
		Teams: []string{"Team 3"},
	}

	var users []User
	users = append(users, user1)
	users = append(users, user2)
	users = append(users, user3)
	users = append(users, user4)

	return users
}

func getTeams() []Team {
	// create some teams
	team1 := Team{
		Name:    "Team 1",
		Members: []string{"Stephen Wright, Dylan Zhou"},
	}
	team2 := Team{
		Name:    "Team 2",
		Members: []string{"user 3"},
	}
	team3 := Team{
		Name:    "Team 3",
		Members: []string{"user 4"},
	}

	var teams []Team
	teams = append(teams, team1)
	teams = append(teams, team2)
	teams = append(teams, team3)
	return teams
}

func getTasks() []Task {
	// create some tasks
	// examples of status: Not started, Started, Done
	task1 := Task{
		Name:        "Homework 1",
		Description: "Homework for csci4210",
		AssignedTo:  []string{"Stephen Wright"},
		Priority:    "Low priority",
		Status:      "Not started",
	}
	task2 := Task{
		Name:        "Homework 2",
		Description: "Homework for csci4210",
		AssignedTo:  []string{"Dylan Zhou"},
		Priority:    "Medium priority",
		Status:      "Started",
	}
	task3 := Task{
		Name:        "Project 1",
		Description: "Project for RCOS",
		AssignedTo:  []string{"Stephen Wright, Dylan Zhou"},
		Priority:    "High priority",
		Status:      "Done",
	}

	var tasks []Task
	tasks = append(tasks, task1)
	tasks = append(tasks, task2)
	tasks = append(tasks, task3)
	return tasks
}
