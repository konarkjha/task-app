# task-app
Steps to run task-app :
git clone  https://github.com/konarkjha/task-app.git

cd task-api

install nodejs Refer: https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/

install yarn Refer: https://linuxize.com/post/how-to-install-yarn-on-ubuntu-18-04/

after installing yarn use:  yarn install

then once installed  if Os is windows use: " npm i windows-env "

then: yarn dev-server  for both window and ubuntu.

1. Api to Register User

curl --location --request POST 'http://localhost:3000/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "test user2",
    "email": "konarkjha@hotmail.com",
    "contactNumber": "5888888889",
    "password": "123456"
}'

2. Api to Verify user with Otp (EMAIL)

curl --location --request POST 'http://localhost:3000/verify' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "90aeb8c1-a522-4ce2-a835-bc7280ea39c1",
    "otp": 8167,
    "firstTimeLogin": true
}'

3. Api to login user with otp

curl --location --request POST 'http://localhost:3000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "konarkjha@gmail.com",
    "loginWithOtp": 1
}'

4. Api to login user with user email and password will work only after user verified

curl --location --request POST 'http://localhost:3000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "konarkjha@gmail.com",
    "password":"123456",
    "loginWithOtp": 0
}'
5. Api to get user details

curl --location --request GET 'localhost:3000/user/dbd8db0e-e111-4cb9-ba3b-098f417e07b0' \
--header 'Authorization: Bearer dbd8db0e-e111-4cb9-ba3b-098f417e07b0,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRiZDhkYjBlLWUxMTEtNGNiOS1iYTNiLTA5OGY0MTdlMDdiMCIsImlhdCI6MTU3ODMzNTcxOCwiZXhwIjoxNTc4OTQwNTE4fQ.cQzXdflbNjkXZkQ4QLxtGC6y-wis6_sWjSmzhiT5cVk'

6. Api to split money equally between multiple friends

curl --location --request POST 'http://localhost:3000/payment/split' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer dbd8db0e-e111-4cb9-ba3b-098f417e07b0,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRiZDhkYjBlLWUxMTEtNGNiOS1iYTNiLTA5OGY0MTdlMDdiMCIsImlhdCI6MTU3ODQwNzE2MCwiZXhwIjoxNTc5MDExOTYwfQ.AU8GdWec9xqCrTBlwWBRRjsNhnvHfhiHnWr5H4TOcx8' \
--data-raw '{
    "amount": 1500,
    "ratioType": "EQUAL",
    "payingFor": "EQUAL TEST",
    "paidBy": "dbd8db0e-e111-4cb9-ba3b-098f417e07b0",
    "userDetails": [
        {
            "userId": "dbd8db0e-e111-4cb9-ba3b-098f417e07b0"
        },
        {
            "userId": "dce966f7-4a4d-448a-84d5-36bf8643902d"
        },
        {
            "userId": "d65ee6f6-10bc-4330-b360-c373e00ad32b"
        },
        {
            "userId": "90aeb8c1-a522-4ce2-a835-bc7280ea39c1"
        }
    ]
}'

7. Api to split amount by given ratio to multiple friend

curl --location --request POST 'http://localhost:3000/payment/split' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer dbd8db0e-e111-4cb9-ba3b-098f417e07b0,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRiZDhkYjBlLWUxMTEtNGNiOS1iYTNiLTA5OGY0MTdlMDdiMCIsImlhdCI6MTU3ODQwNzE2MCwiZXhwIjoxNTc5MDExOTYwfQ.AU8GdWec9xqCrTBlwWBRRjsNhnvHfhiHnWr5H4TOcx8' \
--data-raw '{
    "amount": 1500,
    "ratioType": "PERCENT",
    "payingFor": "PERCENT TEST",
    "paidBy": "dbd8db0e-e111-4cb9-ba3b-098f417e07b0",
    "userDetails": [
        {
            "userId": "dbd8db0e-e111-4cb9-ba3b-098f417e07b0",
            "percentage": 20
        },
        {
            "userId": "dce966f7-4a4d-448a-84d5-36bf8643902d",
            "percentage": 30
        },
        {
            "userId": "d65ee6f6-10bc-4330-b360-c373e00ad32b",
            "percentage": 30
        },
        {
            "userId": "90aeb8c1-a522-4ce2-a835-bc7280ea39c1",
            "percentage": 20
        }
    ]
}'

8. Api to get payment details by user's Id 

curl --location --request GET 'http://localhost:3000/payment/expense/dbd8db0e-e111-4cb9-ba3b-098f417e07b0' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer dbd8db0e-e111-4cb9-ba3b-098f417e07b0,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRiZDhkYjBlLWUxMTEtNGNiOS1iYTNiLTA5OGY0MTdlMDdiMCIsImlhdCI6MTU3ODQwNzE2MCwiZXhwIjoxNTc5MDExOTYwfQ.AU8GdWec9xqCrTBlwWBRRjsNhnvHfhiHnWr5H4TOcx8' \
--data-raw ''
