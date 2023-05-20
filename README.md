# ArteMIS-server
Server side back-end application for [ArteMIS Web](https://github.com/SchadenKai/ArteMIS-Waste-Management-System) and [ArteMIS Mobile](https://github.com/SchadenKai/ArteMIS-Mobile). The server framework heavily depends on Firebase, a backend-as-a-service (BaaS) together with Express, our backend server.

## Services used
- **Firebase function** : Serverless framework that is stored and run in Google cloud.
- **Firestore** : Flexible, scalable NoSQL document database for all platforms. 
- **Firebase Authentication** : used for authenticating users to the app at the same time supporting thirt-party authentication (Google)
- **Firebase Hosting** : used to deploy and host the front-end website on the internet.
- **Firebase Analytics** : keeping track of the activity and performance of the app (Mobile, Website, and Server).

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
- `/waste` - Waste information coming from the Mobile users and processed to the admin dashboard
- `/bin` - Contains data being gathered by ArteMIS IoT Trash bin through sensors. 
- `/trashbin` - Information about each ArteMIS IoT Trahs bin. Used to register new trash bins to the system
- `/auth` - used to authenticated the users 
- `/reports` - contains reports information to be passed on the admin and facility staffs. 
- `/status` - contains summary reports from data collected and processed from Mobile 

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
