# Description
A Rest API to Family Hub backend and database.

# List of endpoints

## /api/users

### POST: /registerUser

### POST: /getUser
### POST: /getUserById
### POST: /updateUser
### POST: /deleteUser

### GET: /getUserById
### GET: /getUser

--- 

## /api/familyGroups

### POST: /createFamilyGroup
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### POST: /getFamilyGroup
### POST: /addMemberToFamilyGroup
### POST: /getFamilyGroupEvents
### POST: /leaveFamilyGroup

### GET: /getFamilyGroup

--- 

## /api/events

### POST: /createEvent
### POST: /updateEvent
### POST: /deleteEvent

### GET: /getEventById
### GET: /getEvents


# Resources: Formatted as JSON

- The result data is formatted using JSON. 

### GET: /Timetable/{bus-stop num}
```
{
   "BusSchedule": [ 
        {
            "routeId": BUS_NUMBER, 
            "lastStopName": FINAL_STOP_NAME, 
            "time": TIME
        }, 
    ...
   ]
}
```

### GET: /Stops/search?area-code={area code}
```
{
    "AreaStops":
    {
        "stopId": STOP_CODE,
        "stopName": STOP_NAME,
        "routeIds": [
            ROUTE_ID, 
            ROUTE_ID, 
            ROUTE_ID
            ...
        ]
    }
}
```

### GET: /Route/{route id}

```
{
    "RouteStops":
    {
        "stopId": STOP_CODE,
        "stopName": STOP_NAME,
        "routeIds": [
            ROUTE_ID,
            ...
        ]
    }
}
```

# Sample request with sample response
TimeTimetable/{bus-stop num}
### GET: /Timetable/17784
Returns:
```
    {
        "BusSchedule":[
            {
                "routeId": 671,
                "lastStopName": "South Point",
                "time": "11:00:00"
            },
            {
                "routeId": 72,
                "lastStopName": "Richmond",
                "time": "11:15:00"
            },
            {
                "routeId": 51,
                "lastStopName": "Downtown",
                "time": "11:30:00"
            }
        ]
    }
```
### GET: /Stops/search?area-code=R3T2M9
Returns:
```
    {
        "AreaStops":[
            {
                "stopId": 12345,
                "stopName": "Hawkstead",
                "routeIds": [
                    51,
                    61,
                    72
                ]
            },
            {
                "stopId": 67898,
                "stopName": "Richmond",
                "routeIds": [
                    91,
                ]
            },
            {
                "stopId": 54313,
                "stopName": "Thornsdale",
                "routeIds": [
                    72,
                    80
                ]
            }
        ]
    }
```
### GET: /Route/671
Returns:
```
    {
        "RouteStops":[
            {
                "stopId": 12351,
                "stopName": "Jimbo",
                "routeIds": [
                    671,
                    672
                ]
            },
            {
                "stopId": 46847,
                "stopName": "Wumbo",
                "routeIds": [
                    671
                ]
            },
            {
                "stopId": 35789,
                "stopName": "Gumbo",
                "routeIds": [
                    671
                ]
            }
        ]
    }
```
