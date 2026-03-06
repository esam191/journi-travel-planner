# Project Proposal: Fullstack Travel Planner Web App \- Journi

## Team Members

- Esam Uddin — 1012865384  
- Iman Cheema — 1007262659  
- Eraj Zaidi — 1007162179

---

## **1\. Motivation**

### Problem

Planning a trip is exciting, but it often becomes stressful and chaotic because of the number of details involved. Travelers have to manage numerous logistics at once, including flights, accommodations, transportation, daily activities, budgets, and important documents. 

To stay organized, many people rely on a combination of spreadsheets for tracking expenses and itineraries, email inboxes for storing tickets and confirmations, and various note-taking applications for saving reservations or activity bookings. However, because these tools are disconnected from one another, information becomes scattered across platforms, and important details are misplaced or forgotten.  

Without a centralized planning system, travellers struggle to view and manage all aspects of their trip in one place. Although commercial platforms like [Expedia.ca](http://Expedia.ca) allow users to book multiple services in a single platform, they focus primarily on reservations rather than overall trip organization and management. 

### 

### Proposed Solution

To address this problem, we are developing a web-based Travel Planner platform that allows users to plan and manage their trips within a single, cohesive system. The platform allows users to organize day-by-day itineraries, search and explore destinations through an integrated map, and upload important travel documents. The goal is to improve organization and reduce the stress often associated with managing travel logistics. 

From a technical perspective, the application is built using TypeScript and [Next.js](http://Next.js) on the frontend, and a [Next.js](http://Next.js) architectural approach. It incorporates user authentication, integration with external APIs, and structured data management using PostgreSQL and Digital Ocean Spaces. The application is designed to meet the outlined technical requirements while ensuring all features work together to provide an organized and enjoyable travel planning experience.  
---

## **2\. Objective and Key Features**

### Objective

The primary objective of our project is to build a secure, responsive full-stack travel planner web application that will allow authenticated users to create trips, organize day-by-day itineraries, search and map places using the Google Maps API, and upload/manage travel documents in Digital Ocean Spaces. The application aims to simplify travel planning by bringing all core itinerary tools into one convenient platform.

### Core Technical Requirements

**1\. Frontend (UI)**

The entire frontend code for this application will be built with TypeScript using the Next.js framework. We will implement a clean, responsive interface that works well on desktop and mobile. Styling will be done with Tailwind CSS, and we will use the shadcn/ui component library to ensure a consistent design system and reusable components (forms, cards, etc.).

**2\. Data Storage**

We will use PostgreSQL as the primary relational database, accessed through Prisma to ensure type-safe queries and schema management. The database will be hosted on Neon to provide reliable managed Postgres for core entities such as users, trips, and itinerary items. For travel documents (e.g., confirmations, tickets, PDFs/images), we will use DigitalOcean Spaces for cloud storage and store file metadata in Postgres to securely link uploads to the correct records.

**Schema and Relationships**  
The database will be designed around a clear relational model to ensure data integrity and secure owner-based access control.

- A **User** can create multiple Trips (one-to-many).  
- Each **Trip** contains multiple **ItineraryItems** (one-to-many).  
- Uploaded **Documents** are stored in DigitalOcean Spaces, while file metadata is stored in Postgres and linked to the owning **User** and associated **Trip**.

**3\. Architecture Approach (Next.js Full-Stack)**

The application will be built using Next.js App Router to support a full-stack architecture within a single codebase. We will leverage Server Components to fetch and render data securely on the server where appropriate, reducing client-side complexity. API Routes will be used for structured endpoints for integrations like file upload/download flows, while Server Actions will handle most write operations (create/update/delete) such as trips and itinerary items, keeping mutations close to the UI and simplifying end-to-end data flow.

### Advanced Features

**1\. User Authentication and Authorization**

The application will support secure and authenticated access using the Better Auth framework. Users will be able to register and log in, and authentication will be managed using session-based or token-based mechanisms provided by Better Auth. All sensitive pages and backend operations will be protected, so only logged-in users can access their trips, itineraries, and uploaded documents. Authorization checks will be enforced on the server to ensure users can only read or modify data that belongs to their own account.

**2\. Integration with External APIs or Services**

The application will integrate the Google Maps API to enhance trip planning with real location-based functionality. Users will be able to search for places using autocomplete, view selected destinations on a map, and retrieve place details (e.g., address and coordinates) to attach to itinerary items. This integration provides meaningful external data and improves the overall itinerary planning experience beyond what the app could provide with only internal data.

### Application Features

- **Dashboard (landing page):** Displays trip overview cards (days, number of itinerary items), upcoming trips section, and a button to add new trip  
- **Trip overview page:** Includes a trip summary section, day-by-day itinerary view, add itinerary items and reorder them.  
- **Add trip page:** Form to add a trip with details like summary and dates.  
- **Places search \+ map view (Google Maps API):** Place autocomplete search (cities, attractions, restaurants), Map view with pins for itinerary items  
- **File uploads for travel documents:** Upload/download files (tickets, confirmations, PDFs/images), attach files to a trip.

### Tech Stack Summary

| Layer | Technology |
| :---- | :---- |
| Frontend \+ Backend | Next.js Full Stack |
| Styling | Tailwind CSS \+ shadcn/ui |
| Database | PostgreSQL via Prisma \+ Neon |
| Cloud Storage | Digital Ocean Spaces |
| Auth | BetterAuth |
| External API | Google Maps API |
| Deployment | Vercel |

### How this fulfills the course project requirements

This project meets the core requirements by using Next.js \+ TypeScript for a responsive UI styled with Tailwind CSS and shadcn/ui, and a TypeScript backend backed by PostgreSQL (Prisma \+ Neon) with DigitalOcean Spaces for file uploads. It also includes two advanced features: Better Auth for secure authentication/protected routes and Google Maps API integration for place search and mapping.

### Scope and Feasibility

This project is well-scoped for a team of 3 over the 4-week development window. The application has a focused domain in travel planning with features that are well-defined and supported by stable tools/services, keeping implementation manageable within the timeframe. Each team member can own distinct parts of the backend, frontend, and core features while collaborating on integration points as laid out in the next section.

---

## **3\. Tentative Plan**

### Team Plan

Our team plans to complete this project using an interactive approach, where development will be done in phases over the duration of 4 weeks. We will begin by setting up the application structure, which includes the backend logic, front-end interface, and database configuration. The next step will be to implement the core functionalities, such as the CRUD operations, before progressively adding additional features and enhancements. The project will be concluded with final testing, review, and deployment. 

### Team Responsibilities

*Subject to change*

**Iman Cheema \- Backend Logic & Database Configuration** 

- Design database scheme using Prisma  
- Implement server actions and API routes for CRUD operations  
- PostgreSQL integration 

**Esam Uddin \- Authorizations and Integrations**

- Implement user authentication and authorization  
- Add Google Maps API functionality  
- Configure DigitalOcean Spaces for file upload 

**Eraj Zaidi \- Front End Implementation**

- Create UI layout and page structure  
- Implement responsive design using Tailwind CSS \+ shadcn/ui  
- Handle client-side interactions and form submissions

**Shared Responsibilities**

- Code reviews  
- Debugging and testing  
- Final integration and deployment

### Plan Outline

**Week 1 — Foundations and Local Development**

- GitHub repository configuration  
- Next.js App router structure  
- Design database scheme using PostgreSQL & Prism

**Week 2 — Core Technical Requirements**

- Implement CRUD operations: Create Account, Add trip, Delete Trip, Edit Details, Display Information, etc  
- Begin frontend styling and layout refinement 

**Week 3 — Advanced Features**

- Integrate Google Maps API  
- Add file upload feature  
- Ensure authorization checks work as expected

**Week 4 — Documentation and Presentation Deliverables**

- Testing and Debugging  
- Final Deployment

---

## **4\. Initial Independent Reasoning (Before Using AI)**

### Application Structure and Architecture

Before consulting any AI tools, our team discussed how to structure the application. Initially, we considered separating the backend and frontend into 2 distinct projects, however we realized this could cause complications during data fetching and integration between the two layers. Given our prior experience with Next.js, we decided to use a single Next.js full-stack codebase, as it will simplify development and maintain consistency.

### Data and State Design

For the data storage and retrieval aspect of this project, we started by considering using SQLite, as all of us have more experience with it from our undergrad courses. However, due to its limited support for database features like views, triggers, and procedures, we decided it would not be sufficient for our project, as we wanted something more comprehensive and secure. Ultimately, we decided to use PostgreSQL as it has extended support for multiple data types, more powerful queries, and advanced view types.

### Feature Selection and Scope Decisions

Our initial motivation for this application was to provide users with a comprehensive, all-in-one application platform for trip planning that includes all essential features in one place. We began by identifying core functionalities such as user authentication, creating/deleting/editing trips, and uploading important files. One extra feature we considered was enabling notifications and reminders, but given the limited timeline and small team size, we agreed to focus on mandatory project requirements and keep this as a temporary feature that will be implemented if time permits.

### Anticipated Challenges

A few challenges we identified during early discussions included integrating the Google Maps API, as working with third-party software platforms results in configuration and compatibility issues. Another potential challenge was using Digital Ocean Spaces for cloud storage, due to a lack of experience. Furthermore, we expected multiple errors when integrating the front-end and backend systems.  

### Early Collaboration Plan

From the early stages of planning, we planned to divide the responsibilities according to project area while also focusing on team members’ skill sets. The most effective approach was to organize the work into three categories: backend development, front-end development, and external integrations. This method allowed us to assign the team member with stronger database and server-side experience to the backend, the member with stronger UI and client-side skills to the frontend, and the more application-driven member to focus on authentication and third-party integration. Although there are individual tasks, we plan to coordinate work through regular check-ins and assist each other as much as possible. The work will be monitored through shared version control to ensure smooth collaboration and consistent progress. 

---

## **5\. AI Assistance Disclosure**

We did not rely on AI much for this proposal and most of the work was done collaboratively as a team. Each member brainstormed project ideas independently, and then we came together to choose the best idea and develop our solution through team discussions. 

### Parts Developed Without AI Assistance

All aspects of the proposal, including the project topic, motivation, tentative plan, and team responsibilities, were developed entirely by the team. The core technical requirements were guided by the project outline. 

### AI-Assisted Parts

AI was mainly used to explore technical options and expand our ideas. For example, we decided to integrate the Google Maps API to let users search for destinations on a map and retrieve relevant details corresponding to that location. However, we used AI to brainstorm additional possibilities, such as the OpenWeather API for showing real-time weather and the Eventbrite API for finding local events. We ultimately decided to focus on the Google Maps API for now, but plan to keep these other options in mind for potential future enhancements.

### AI Influence Example

A specific way AI influenced our proposal was in evaluating the technical architecture in more detail. AI helped us weigh the pros and cons of each option: a [Next.js](http://Next.js) full-stack approach allows for simpler and faster development but is less flexible, whereas a separate frontend and backend setup offers greater flexibility but is more complex to develop. Understanding these differences guided our decision, and we chose to implement a full [Next.js](http://Next.js) application. 