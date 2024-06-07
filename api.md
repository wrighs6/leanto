## `/tasks`
### GET
* **Description** Retrieve a list of all tasks.
* **Example Response**
```
[
  {
    "name": "Example Task",
    "description": "This is the description for this task.",
    "team": "Team 1"
    "assignedTo": [ "Stephen Wright" ],
    "priority": "Low",
    "status": "In Progress"
  },
  ...
]
```

### POST
* **Description** Creates a new task and adds it to the existing list of tasks
* **Example Response**
```
[
  {
    "name": "Example Task",
    "description": "This is the description for this task.",
    "team": "Team 1"
    "assignedTo": [ "Stephen Wright" ],
    "priority": "Low",
    "status": "In Progress"
  },
  {
    "name": "New Task",
    "description": "This is a description for the new task",
    "team": "Team 2"
    "assignedTo": [ "Dylan Zhou" ],
    "priority": "Medium",
    "status": "In Progress"
  }
]
```

## `/teams`
### GET
* **Description** Retrieve a list of all teams.
* **Example Response**
```
[
  {
    "name": "Team 1",
    "members": [ "Stephen Wright", "Dylan Zhou" ]
  },
  {
    "name": "Team 2",
    "members": [ "Stephen Wright", "Other User" ]
  }
]
```

### POST
* **Description** Creates a new team and adds it to existing list of teams 
* **Example Response**
```
[
  {
    "name": "Team 1",
    "members": [ "Stephen Wright", "Dylan Zhou" ]
  },
  {
    "name": "Team 2",
    "members": [ "Stephen Wright", "Other User" ]
  },
  {
    "name": "Team 3",
    "members": [ "Other User", "Other User" ]
  }
]
```

## `/users`
### GET
* **Description** Retrieve a list of all users.
* **Example Response**
```
[
  {
    "name": "Stephen Wright",
    "teams": [ "Team 1", "Team 2" ]
  },
  {
    "name": "Dylan Zhou",
    "teams": [ "Team 1" ]
  },
  {
    "name": "Other User",
    "teams": [ "Team 2" ]
  }
]
```

### POST
* **Description** Creates a new user and adds it to the existing list of users 
* **Example Response**
```
[
  {
    "name": "Stephen Wright",
    "teams": [ "Team 1", "Team 2" ]
  },
  {
    "name": "Dylan Zhou",
    "teams": [ "Team 1" ]
  },
  {
    "name": "Other User",
    "teams": [ "Team 2" ]
  },
  {
    "name": "Default User",
    "teams": [ "Team 3" ]
  }
]
```
