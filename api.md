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
