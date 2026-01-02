# Initial Vision

This is a productivity project personally develop to allow the author to get back into a daily development practice, initially for personal use.  It is an initial project with a little more than just a timer, to keep track on users performance and to allow to make a report to users who want to use it. 

## Initial Stack
The idea for the frontend is to keep it simple. I could develop using just vanilla javascript, css and html, but I'm not into the recent updates of React, so I'll use it so I can get in touch with. 

For server side I'll use koa.js, which is not as opinionated as NestJS and requires more manual work to do. Which deliver against my practice goals.


## Architecture
Even though I plan to make a good server-side job at controlling the state of the user pomodoro, the initial plan is to go against the use of websocket. This won't enable the server to push notification to clients, but it will make the first development plan simpler, by making a pooler request from the client to server to keep the counter updated. 
This is not a good decision to scale, but the idea is to work on this improvement once the project is running. 
This is a deliberate temporary trade-off, not a final architecture decision

## Deploy
I want to use personal development to get hands-on into kubernetes orchestration. I'm not sure how can I do this yet in this project, but I think I will go dive deep into this subject once the first version get ready to go prod. The first production version may run in a simples setup with Kubernetes introduced later as a learning step.