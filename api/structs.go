package main

/*
Holds the different teams
*/
type Team struct {
	Name    string   `json:"name"`
	Members []string `json:"members"`
}

/*
Holds the different tasks/files from the user
*/
type Task struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	AssignedTo  []string `json:"assingment"`
	Priority    string   `json:"priority"`
	Status      string   `json:"status"`
}

/*
Holds the information of users
*/
type User struct {
	Name  string   `json:"name"`
	Tasks []string `json:"tasks"`
	Teams []string `json:"teams"`
}
