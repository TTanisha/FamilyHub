# Description
A Rest API to Family Hub backend and database.

# List of endpoints

## **/api/users**

### **POST:** /registerUser
```
"body":
    {
        "userId": "myUserId", 
    }
```
### **POST:** /getUser
```
"body":
    {
        "userId": "myUserId", 
    }
```
### **POST:** /getUserById
```
"body":
    {
        "userId": "myUserId", 
    }
```
### **POST:** /updateUser
```
"body":
    {
        "userId": "myUserId", 
    }
```
### **POST:** /deleteUser
```
"body":
    {
        "userId": "myUserId", 
    }
```
### **GET:** /getUserById
```
"body":
    {
        "userId": "myUserId", 
    }
```
### **GET:** /getUser
```
"body":
    {
        "userId": "myUserId", 
    }
```

--- 

## **/api/familyGroups**

### **POST:** /createFamilyGroup
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### **POST:** /getFamilyGroup
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### **POST:** /addMemberToFamilyGroup
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### **POST:** /getFamilyGroupEvents
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### **POST:** /leaveFamilyGroup
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### **GET:** /getFamilyGroup
```
"body":
    {
        "groupName": "myGroupName", 
    }
```

--- 

## **/api/events**

### **POST:** /createEvent
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### **POST:** /updateEvent
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### **POST:** /deleteEvent
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### **GET:** /getEventById
```
"body":
    {
        "groupName": "myGroupName", 
    }
```
### **GET:** /getEvents
```
"body":
    {
        "groupName": "myGroupName", 
    }
```


