# REST API

The REST API for mailing service is listed below

## Login user

### Request

`POST /authentication/login`

### Request body

```yaml
{
   "username": "myBeautifulUsername",
   "password": "topSecretNeverSeenPassword"
}
```

### Response body

Response for correct credentials
`Status code: 200 OK`

```yaml
{
    "userDto": {
        "username": "myBeautifulUsername",
        "firstName": "firstOfMyName",
        "lastName": "lastOfMyName",
        "dob": "2022-12-03"
    }
}
```

Response if credentials are incorrect `Status Code: 401 Unauthorized` <br />
Response for bad request `Status code: 400 Bad Request`

```yaml
{
    "userDto": null
}
```

## Register user

### Request

`POST /authentication/register`

### Request body

```yaml
{
    "username": "myBeautifulUsername",
    "password": "topSecretNeverSeenPassword",
    "firstName": "firstOfMyName",
    "lastName": "lastOfMyName",
    "dob": "2022-12-03"
}
```

### Response body

Response if the user doesn't already exist
`Status code: 201 Created`

```yaml
{
    "isSuccess": true
}
```

Response if the user already exists `Status Code: 409 Conflict` <br />
Response for bad request `Status code: 400 Bad Request`

```yaml
{
    "isSuccess": false
}
```

## Change user password

### Request

`POST /authentication/changePassword`

### Request body

```yaml
{
   "username": "myBeautifulUsername",
   "newPassword": "topSecretNeverSeenPassword"
}
```

### Response body

Response if the password is changed successfully `Status code: 200 OK`

```yaml
{
    "isSuccess": true
}
```

Response if the user doesn't exist `Status code: 404 Not Found` <br />
Response if the new password is the same as old `Status code: 409 Conflict` <br />
Response for bad request `Status code: 400 Bad Request`

```yaml
{
    "isSuccess": false
}
```

## Get Sent Mails

### Request

`GET /mailService/sent`

### Request Header
`Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ= (username:password in base64 encoding)`

### Request Body

```yaml
none
```

### Response body

Response if the user is present in the system `Status code: 200 OK`

```yaml
[
    {
        "id": 5,
        "sender": {
            "username": "myBeautifulSenderUsername",
            "firstName": "firstOfMyName",
            "lastName": "lastOfMyName",
            "dob": "2022-12-03"
        },
        "dateTime": "2023-04-27T19:25:00",
        "subject": "DANCE GAVIN DANCE",
        "content": "WE OWN THE NIGHT",
        "receivers": [
            {
                "username": "myBeautifulReceiverUsername1",
                "firstName": "firstOfMyName",
                "lastName": "lastOfMyName",
                "dob": "2022-12-03"
            },
            {
                "username": "myBeautifulReceiverUsername2",
                "firstName": "firstOfMyName",
                "lastName": "lastOfMyName",
                "dob": "2022-12-03"
            }
        ]
    },
    ...
]
```

Response if the user does not exist `Status code: 401 Unauthorized`

```yaml
none
```

## Get Received Mails

### Request

`GET /mailService/received`

### Request Header
`Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ= (username:password in base64 encoding)`

### Request Body

```yaml
none
```

### Response body

Response if the user is present in the system `Status code: 200 OK`

```yaml
[
    {
        "id": 5,
        "sender": {
            "username": "myBeautifulSenderUsername",
            "firstName": "firstOfMyName",
            "lastName": "lastOfMyName",
            "dob": "2022-12-03"
        },
        "dateTime": "2023-04-27T19:25:00",
        "subject": "DANCE GAVIN DANCE",
        "content": "WE OWN THE NIGHT",
        "receivers": [
            // the only receiver is the user requesting
            {
                "username": "myBeautifulReceiverUsername1",
                "firstName": "firstOfMyName",
                "lastName": "lastOfMyName",
                "dob": "2022-12-03"
            }
        ]  
    },
    ...
]
```

Response if the user does not exist `Status code: 401 Unauthorized`

```yaml
none
```

## Send Mail

### Request

`POST /mailService/sendMail`

### Request Header

`Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ= (username:password in base64 encoding)`

### Request Body

```yaml
{
    "receiverUsernames": [
        "myBeautifulReceiverUsername1",
        "myBeautifulReceiverUsername1"
    ],
    "subject": "DANCE GAVIN DANCE",
    "content": "WE OWN THE NIGHT"
}
```

### Response Body

Response if the sender and all receivers are present in the system `Status code: 200 OK`

```yaml
{
    "isSuccess": true
}
```

Response if sender is not present at the system `Status code: 401 Unauthorized`

```yaml
none
```

Response if any of the receivers are not present in the system `Status code: 404 Not Found`

```yaml
{
    "isSuccess": false
}
```

## Get All Replies For Mail (Mail Thread)

### Request

`GET /mailService/mailThreads/{mailId}`

### Request Header
`Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ= (username:password in base64 encoding)`

### Request Body

```yaml
none
```

### Response body

Response if the user is present in the system `Status Code: 200 OK`

```yaml
[
    {
        "username": "myBeautifulUsername1",
        "dateTime": "2023-05-03 15:00:00",
        "content": "I AM CONTENT WITH THIS CONTENT"
    },
    {
        "username": "myBeautifulUsername2",
        "dateTime": "2023-05-03T15:00:00",
        "content": "CONTEXT OF THE CONTENT IS CONTEXTUAL!"
    },
    ...
]
```

Response if the user requesting is not present in the system `Status Code: 401 Unauthorized`

```yaml
none
```

## Send Mail Reply (Mail Thread)

### Request

`POST /mailService/sendMailThread`

### Request Header

`Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ= (username:password in base64 encoding)`

### Request body

```yaml
{
    "mailId": 5,
    "content": "Glorious mail reply content, worthy of a thousand mails"
}
```

### Response body

Response if the sender is present in the system `Status code: 201 Created`

```yaml
{
    "isSuccess": true
}
```

Response if the mail from the id is not present in the system `Status code: 404 Not Found`

```yaml
{
    "isSuccess": false
}
```

Response if the sender is not present in the system `Status code: 401 Unauthorized`

```yaml
none
```
