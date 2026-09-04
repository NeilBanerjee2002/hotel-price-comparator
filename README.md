# Hotel Rate Comparator

A hotel search application built with React, Node.js, TypeScript, and Temporal.

The application searches hotel rates from two mock suppliers in parallel and returns the cheapest available hotel.

## Architecture

React Frontend
        |
        v
Node.js / Express API
        |
        v
Temporal Client
        |
        v
Temporal Workflow
        |
        +------ Supplier A Activity
        |
        +------ Supplier B Activity
                 |
                 v
          Mock Supplier APIs

## Tech Stack

- React + TypeScript
- Node.js + Express
- Temporal
- MySQL
- Docker
- Axios

## Project Structure

```text
hotel-rate-comparator/
├── backend/
│   └── src/
│       ├── activities/
│       ├── api/
│       ├── temporal/
│       ├── types/
│       ├── workflows/
│       └── server.ts
├── frontend/
├── docker-compose.yml
└── README.md