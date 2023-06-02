# ArteMIS-server
Server side back-end application for [ArteMIS Web](https://github.com/SchadenKai/ArteMIS-Waste-Management-System) and [ArteMIS Mobile](https://github.com/SchadenKai/ArteMIS-Mobile). The server framework heavily depends on Firebase, a backend-as-a-service (BaaS) together with Express, our backend server.

## Services used
- **Firebase function** : Serverless framework that is stored and run in Google cloud.
- **Firestore** : Flexible, scalable NoSQL document database for all platforms. 
- **Firebase Authentication** : used for authenticating users to the app at the same time supporting thirt-party authentication (Google)
- **Firebase Hosting** : used to deploy and host the front-end website on the internet.
- **Firebase Analytics** : keeping track of the activity and performance of the app (Mobile, Website, and Server).
- **Cloud Scheduler** : Set scheduled execution of Firebase function

## Technologies used
- **Express** : back end web applicatio used to build ArteMIS APIs with RESTful architecture. 

## Getting Started
### Requirements
  - Firebase config file - this contains API key. Get this from firebase Artemis' project console. `(Console > Project Settings > ArteMIS Web)`
  - Firebase CLI : Open the terminal and type (You need to have NodeJS installed on your system)
 ```
 npm i firebase
 ```

### Scripts
- `npm run start` - starting development environment 
- `npm run deploy` - deploy the source code as an API to the Firebase function for use 
- `npm run server` - create a emulator environment for the source code for testing

## API Routes
### URL
```
https://us-central1-artemis-b18ae.cloudfunctions.net/server
```
### Methods
`POST` | `PUT` | `PATCH` | `GET` | `DELETE`

### Endpoints
- `/waste` - get all the waste information for the duration of the project
- `/waste/latest` - get the current day's data of waste management
- `/waste/latest/7days` - get the waste management data from the last 7 days 
- `/waste/latest/30days - get the waste management data from the last 30 days 
- `/bin` - Contains data being gathered by ArteMIS IoT Trash bin through sensors.
- `/waste/highest` - get the document with the highest overall waste generated weight.
- `/waste/lowest` - get the document with the lowest overall waste generated weight.
- `/trashbin` - Information about each ArteMIS IoT Trahs bin. Used to register new trash bins to the system
- `/auth` - used to authenticated the users 
- `/reports` - contains reports information to be passed on the admin and facility staffs. 
- `/status` - contains summary reports of collected and processed data. This is geenerated per day.
- `/status/latest` - get the latest summary report for the current day. This also contains latest updates in the database.
- `/status/monthly` - contains overall data for the whole duration of the month. This is updated in realtime.
- `/status/monthly/latest` - gets the latest / current month data. 
- `/building` - list of campus and building within each campus. Each building contains coordinates of its location. 
- `/building/:campus_name` - get only the building for the specified campus and their geolocation which contains the latitude and longitude position of it.

### Data Request Schema 
- `/waste/:id` (PATCH / PUT) - the id will be coming from the latest doc in the collection. Get this from `/waste/latest`
  ```
    {
        <building_name (string)> : {
            "campus" : <campus_name (string)>,
            "weight" : {
                "food_waste" : <food_waste_weight (numbers)>,
                "recyclable" : <recyclable_weight (numbers)>,
                "residual" : <residual_weight (numbers)>,
                "total" : <food_waste + recyclable + residual>
            }
        }
    }
  ```
- `/bin` (POST)
```
{
    "capacity" : <capacity_in_percentage (numbers)>,
    "trashbin" : "trashbin/<trashbin_id>" (reference)
}
```
- `/trashbin/:id` (POST) - custom id to be set and must not be existing (ex. artemis.a1)
```
{
    "campus" : <campus_name (string)>,
    "coordinates" : <longitude and latitude (geolocation)>,
    "school" : <school_name>,
    "type" : <trashbin_type>
}
```
- `/reports` (POST)
```
{
    "title" : <report_title (string)>,
    "campus" : <campus_name (string)>,
    "location" : <latitude and longitude values (geolocation)>
    "description" : <textarea_values (string)>
}
```
- `/building` (PUT)
```
{
    "building_name" : <building name (string)>
    "latitude" : <(numbers)>,
    "longitude" : <(numbers)>
}
```
