# Pokémon Pokedex Application

This project implements a single-page Pokedex application using React, TypeScript, and a lightweight Node.js/Express backend to fetch and manage Pokémon data from the PokeAPI.

The application adheres to the technical requirements for login, protected routing, data presentation, search, sorting, pagination, and detailed views, while maintaining a clean architecture and comprehensive test coverage.

## Project Overview and Architecture

### Stack

* **Frontend:** React (Functional Components & Hooks), TypeScript, Vite, React-Router-DOM, Bootstrap.
* **Backend:** Node.js, Express.js (acting as an API Gateway), Axios, and dotenv.
* **Testing:** Vitest, @testing-library/react, and @testing-library/jest-dom.

### Frontend Features Implemented

[cite_start]The application architecture is based on **Clean Architecture principles**[cite: 77], separating the UI (`pages`), business logic (`context`), and infrastructure (`api/axios`).

1.  [cite_start]**Login Screen**[cite: 9]:
    * [cite_start]User authentication is handled by a backend `/login` endpoint[cite: 10, 39].
    * [cite_start]**Credentials:** `username: admin`, `password: admin`[cite: 11].
    * [cite_start]**Validation:** Client-side checks for empty fields and server-side validation for incorrect credentials are implemented[cite: 12].
    * [cite_start]**Session Management:** The user session is persisted using `localStorage` [cite: 13] and managed via the `AuthContext` (React Context API).

2.  [cite_start]**Route Protection**[cite: 14]:
    * Implemented using `ProtectedRoute` and `PublicRoute` wrappers. Logged-in users are redirected from `/login` to `/` (main page), and unauthenticated users accessing protected routes are redirected to `/login`.

3.  [cite_start]**Main Page (Pokedex List)**[cite: 15]:
    * [cite_start]Fetches paginated Pokémon data from the backend's `/pokemons` endpoint[cite: 18, 40].
    * [cite_start]**Data Display:** Each Pokémon is displayed with its image, name (capitalized), and ID number (e.g., #001)[cite: 20].
    * **Functionality:**
        * **Search:** Live filtering by Pokémon name is handled on the client-side.
        * [cite_start]**Sorting:** Users can sort the list by **Name (A-Z)** or **Number (ID)**[cite: 19].
        * **Pagination:** Implemented using `next` and `previous` links provided by the API response.

4.  [cite_start]**Detail View**[cite: 23]:
    * Navigates to `/pokemon/:id`.
    * [cite_start]Displays detailed information fetched from the backend's `/pokemons/:id` endpoint[cite: 24, 41].
    * [cite_start]Information displayed includes: Pokémon name, ID, height, weight, **Abilities**, **Forms**, and the **first 10 Moves**[cite: 24].

### Backend API Gateway (`ballastLane_test/backend`)

[cite_start]The backend is an Express.js server that acts as a simple proxy to the external PokeAPI[cite: 36].

| Endpoint | Method | Purpose | Source Reference |
| :--- | :--- | :--- | :--- |
| `/api/login` | POST | [cite_start]Handles credential validation (`admin`/`admin`)[cite: 39]. [cite_start]| [cite: 39] |
| `/api/pokemons` | GET | [cite_start]Fetches paginated Pokémon list from PokeAPI (`/pokemon?limit=20&offset=0`)[cite: 40]. [cite_start]| [cite: 40] |
| `/api/pokemons/:id` | GET | [cite_start]Fetches detailed Pokémon data from PokeAPI, filters fields, and handles 404 errors correctly[cite: 41]. [cite_start]| [cite: 41] |

### Testing

[cite_start]The application includes unit tests using **Vitest** and **React Testing Library** for crucial components and logic[cite: 78]:

* `LoginPage.test.tsx`: Covers successful login, failed login, and UI validation states.
* `DetailPage.test.tsx`: Covers successful data fetching, loading states, and error handling for invalid IDs.
* `MainPage.test.tsx`: Covers data fetching on load, loading/error states, client-side searching, sorting, and pagination logic.

---

## 🚀 Generative AI Implementation Task

[cite_start]This section documents the simulated process of using a Generative AI tool (GenAI) to create an API scaffold for a separate Task Management System, as required by the technical exercise[cite: 54]. [cite_start]This demonstrates proficiency in prompt engineering and critical code review[cite: 83, 86].

### 1. Prompt Used (Instruction to the AI)

The objective was to generate a basic CRUD RESTful API scaffold using Node.js and TypeScript, simulating an in-memory database for a task system.