#!/bin/bash
run_server()  {
    cd server
    start yarn start
}
run_frontend()  {
    cd frontend
    start yarn dev
}
run_server &
run_frontend