# Journi \- Final Report

## Team Information

| Name | Student Number | Email Address |
| :---: | :---: | :---: |
| Esam Uddin | 1012865384 | [esam.uddin@mail.utoronto.ca](mailto:esam.uddin@mail.utoronto.ca) |
| Iman Cheema | 1007262659 | [iman.cheema@mail.utoronto.ca](mailto:iman.cheema@mail.utoronto.ca) |
| Eraj Zaidi | 1007162179 | [e.zaidi@mail.utoronto.ca](mailto:e.zaidi@mail.utoronto.ca) |

## Motivation

Planning a trip is an exciting experience, but it often becomes overwhelming due to the number of logistical details involved, including flights, accommodations, transportation, daily activities, budgets, and important documents. Most travelers try to stay organized by using a variety of tools, such as spreadsheets for expense tracking, email inboxes for storing tickets, and booking apps for reservations. However, because these tools exist on separate platforms, information becomes scattered, which makes it difficult to keep everything organized and easily accessible.

Current solutions do not fully address the need for a centralized trip management platform. Commercial platforms services like Expedia.ca allow users to book multiple aspects of a trip in one place, however they primarily focus on reservations rather than helping users organize and manage their entire travel experience.

To address this gap, we built *Journi*, an all-in-one platform that allows users to plan day-by-day itineraries, explore destinations through an integrated map, view AI generated itineraries and store important travel documents. This project allowed us to solve a problem we’ve personally faced while planning trips, while also giving us the opportunity to build a full-stack Next.js application with integrated frontend and data storage.

## Objectives

The objective of this project was to design and implement a full-stack web application that simplifies and organizes the travel planning process. We aimed to build a practical platform that helps users manage trips more efficiently by combining itinerary organization, destination exploration, AI-assisted planning, and secure document storage within a single system.

Specifically, the platform was designed to allow users to:

* create and manage trips,  
* organize detailed travel itineraries,  
* receive AI-generated itinerary suggestions,  
* explore destinations through an interactive map, and  
* store and access important travel documents.

To achieve these goals, we focused on implementing the core technical requirements of the course. This included developing a responsive frontend using TypeScript, Next.js, and Tailwind CSS with reusable UI components to provide a consistent and user-friendly experience, managing structured application data with PostgreSQL, and using Next.js as a full-stack framework to support both frontend and backend functionality. We also integrated DigitalOcean Spaces for file storage to support travel document management.

In addition to the core requirements, we aimed to implement advanced features that included user authentication and authorization using Better Auth for secure registration and login, as well as integration with external services and APIs. Specifically, we used the Google Maps and Places APIs to support destination search and interactive trip visualization, the Unsplash API to provide trip cover images, and the Groq API to generate AI-assisted itineraries.

Overall, the project aimed to deliver a cohesive, secure, and practical travel planning platform while demonstrating the full-stack design and implementation skills required by the course.

## Technical Stack

### Approach: Next.js Full Stack

This application was built using a Next.js full-stack approach with the App Router and TypeScript. This allowed us to seamlessly integrate both the frontend and server-side logic into a single codebase. We used Tailwind CSS for styling and shadcn/ui to build reusable UI components. Server components were used for authenticated pages and data fetching, which helped improve performance and reduce unnecessary client-side complexity. Client components were used for interactive features such as itinerary editing and map interaction. Server actions were used for authenticated CRUD operations such as creating trips, managing itinerary items, and handling document metadata, while Next.js route handlers were used for auth, file uploads, trip cover image retrieval, Google Places search, and AI itinerary generation.

### Database: PostgreSQL with Prisma

The application uses PostgreSQL as its primary relational database and Prisma as its ORM for schema management and type-safe database access. The database is hosted on Neon, providing a reliable and efficient solution for core entities such as users, trips, itinerary items, and documents.

### Authentication and Authorization: Better Auth

Authentication is implemented with Better Auth using the Prisma adapter. The system supports both email/password authentication and social login through Google and GitHub. Session-based access control is used to protect dashboard pages, trip data, itinerary editing, and document operations so that users can access only their own content.

### Cloud Storage: DigitalOcean Spaces

DigitalOcean Spaces was used as S3-compatible cloud object storage to securely store, retrieve and manage travel documents (e.g., confirmations, tickets, PDFs, and images). The files remain updated and securely linked through metadata stored in Postgres, which links uploads to the appropriate trip and user.

## Features

* **Login / Sign-Up Pages:** Forms to create an account using email/password credentials or social login through Google and GitHub. Protected routes ensure that only authenticated users can access their trips, itineraries, and uploaded documents.   
  → **Advanced Feature:** User Authentication and Authorization  
* **Dashboard (Home Page):** Displays trip overview cards (days, number of itinerary items, and number of upcoming trips), and provides quick access to create new trips or view existing ones.   
  → **Core Requirement:** Data Storage (Reading from PostgreSQL table)  
* **Add Trip Page:** Form to add a trip by entering a title, description, and travel dates.  
  → **CRUD Operations:** Create  
* **Trip Overview Page:** Shows a trip summary section and allows users to update or remove trips from their account. Also includes the trip workspace with the features listed below   
  → **CRUD Operations:** Read, Update, Delete  
  * **Itineraries:** Add, reorder by drag-and-drop, or remove itinerary stops to organize travel plans in a structured way.   
    **→ CRUD Operations:** Read, Create, Update, Delete

  * **AI-Assisted Itinerary:** generate day-by-day plans with suggested activities, timing, and estimated costs using AI (Groq) based on destination and duration  
    → **Advanced Feature:** Integration with External APIs or Services  
  * **Places Search \+ Map View (Google Maps API):** Includes place autocomplete search (cities, attractions, restaurants) and a map view with pins for itinerary items   
    → **Advanced Feature:** Integration with External APIs or Services  
  * **File Uploads for Travel documents:** View, upload, download, and delete important documents (tickets, confirmations, PDFs),which are linked to a trip  
    → **Core Requirement:** Cloud Storage  
  * **Image Generation:** The Unsplash API is used to dynamically generate trip cover images based on the user’s destination input, enhancing visual appeal and personalization   
    → **Advanced Feature:** Integration with External APIs or Services

These features satisfy the course requirements by demonstrating a full-stack web app with CRUD functionality, relational database storage, cloud file storage, authentication, and external API integration. They also achieve our project’s main objective of creating a practical and organized travel planner that combines trip management, itinerary planning, destination exploration, AI assistance, and document storage in one platform.

## User Guide

### 1\. Getting Started

1. Open your browser and navigate to the deployed app URL running on vercel: [https://journi-two.vercel.app/](https://journi-two.vercel.app/)  
2. On the landing page, click Log In if you already have an account, or Sign Up if you need to create a new account.

![][image1]

### 2\. Authentication

#### To Sign Up:

1. Click the Sign Up button on the top navbar.  
2. Enter your Name, Email, and Password.  
3. Click Sign Up for Free to create your account.  
4. Optionally, you can sign up using Google or Github.

#### To Log In:

1. Enter your registered Email and Password.  
2. Click Log In via Email to access the application.

![][image2]

### 3\. Dashboard

On the Dashboard, you will see an overview of your travel plans:

* Total number of trips you have created.  
* Number of upcoming trips.  
* Total number of planned places and activities across all trips.

Below these stats, you can see all your trips displayed as trip cards. If you haven’t created any trips yet, the Dashboard will show “Your trips are empty” and prompt you to add your first trip.

![][image3]

#### To Create a Trip:

1. Click \+ New Trip button.  
2. Enter the Title, Description, Start Date, and End Date for your trip. You can optionally upload an image as well.  
   * If no image is added, the system automatically generates it based on the trip title and description.  
3. Click Create Trip.  
4. Your new trip will appear as a trip card on the Dashboard page.

![][image4]  
![][image5]

### 4\. Trip Page Overview

When you open a specific trip card from the Dashboard, you are taken to the Trip Page which shows details and the workspace for that trip. Here, you have the options to Edit or Delete the trip.

![][image6]

#### To Edit Trip Details:

1. Click the Edit Details button located at the top right corner.  
2. Enter the Title, Description, Start Date, and End Date as needed.  
3. Click Save Changes to apply your updates.

![][image7]

#### To Delete a Trip:

1. Click the Delete Trip button at the top right corner next to the Edit button.  
2. Confirm the action by clicking Delete Trip in the confirmation popup.

At the top of the Trip Page, you can see trip statistics:

* Duration: the total length of the trip.  
* Itinerary: The number of planned stops or activities.  
* Documents: The number of uploaded travel documents.

Below the statistics, you will see the Trip Workspace, which is divided into three main tabs: Itinerary, Map, and Documents.

### 5\. Itinerary

Click the Itinerary tab in the Trip Workspace:

#### To Add a Stop:

1. Click the Add Stop button.  
2. Search for a location in the popup modal.  
3. Click Add Stop to add the location to your itinerary.  
4. If you have multiple stops, drag and drop itinerary items to rearrange their order.

#### To Delete a Stop:

1. Click the red trash can icon on the itinerary item you want to remove.  
2. Confirm deletion by clicking Delete Item in the popup modal.  
3. The itinerary item will be removed from your trip.

You can also click the Generate with AI button in the AI Planner section to create a day-by-day itinerary based on your trip’s destination and duration.

![][image8]  
![][image9]

### 6\. Map

1. Click the Map tab in the Trip Workspace.  
2. View all itinerary stops plotted on the Google Map.  
3. Zoom in or out to explore specific areas.  
4. Click a stop marker to see its name.

*Note:* Changing the stop order in the Itinerary tab automatically updates the order in the Map tab.

![][image10]

### 7\. Documents

1. Click the Documents tab in the Trip Workspace.  
2. Click the Upload Document button.  
3. Select a file from your device (e.g., PDF, image, document file).  
4. The file will appear in the Documents tab, and securely stored in DigitalOcean Spaces.  
5. Click the Download button to download a document.  
6. Click the red trash can icon to delete a document.

![][image11]

## Development Guide

### Environment Setup and Configuration

1. Install dependencies:

npm install

2. Copy `.env.example` to `.env`.  
3. Configure the required environment variables:  
     
* `BETTER_AUTH_SECRET`: secret used by Better Auth for signing sessions.  
* `BETTER_AUTH_URL`: base URL for the current environment. Use `http://localhost:3000` for local development and set the deployed Vercel URL in production.  
* `DATABASE_URL`: PostgreSQL connection string used by Prisma (hosted on Neon).  
* `GOOGLE_MAPS_API_KEY`: server-side Google Places API key used for place autocomplete and place details lookup.  
* `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: browser Google Maps API key used to render the trip map.  
* `SPACES_KEY`, `SPACES_SECRET`, `SPACES_REGION`, `SPACES_ENDPOINT`, `SPACES_BUCKET`: DigitalOcean Spaces credentials and bucket configuration used for document uploads.  
* `UNSPLASH_ACCESS_KEY`: used by the image route to fetch trip cover images.  
* `GROQ_API_KEY`: used by the AI itinerary generator.  
* `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: used for Google social login.  
* `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`: used for GitHub social login.

4. Notes:  
* Prisma Client is generated automatically during `npm install` through the `postinstall` script.  
* For local development, Better Auth trusts `http://localhost:3000`. For Vercel deployments, the deployed domain should also be set through `BETTER_AUTH_URL`.

### Database Initialization

This project uses Prisma with PostgreSQL (hosted on Neon). The schema is defined in `prisma/schema.prisma`, and checked-in migrations are stored in `prisma/migrations`.

For a fresh local database:

**npx prisma migrate dev**

If needed, Prisma Client can also be generated manually:

**npx prisma generate**

### Cloud Storage Configuration

Trip document uploads are stored in DigitalOcean Spaces using the AWS S3 SDK compatibility layer.

Required configuration:

* `SPACES_ENDPOINT`: for example `https://tor1.digitaloceanspaces.com`  
* `SPACES_REGION`: for example `tor1`  
* `SPACES_BUCKET`: public bucket used to store uploaded files  
* `SPACES_KEY` and `SPACES_SECRET`: access credentials for the bucket

### API Endpoints

* `GET, POST /api/auth/[...all]`: Better Auth endpoint used for sign-in, sign-up, session, sign-out, and provider auth flows.
* `GET /api/image?query=<search text>`: fetches a trip cover image from Unsplash and returns `{ imageUrl }`. Returns `400` if `query` is missing.
* `POST /api/upload`: accepts `multipart/form-data` with a `file` field, uploads the file to DigitalOcean Spaces, and returns `{ url }`. Returns `400` for invalid content type or missing file.
* `GET /api/places/autocomplete?input=<search text>`: authenticated endpoint that uses Google Places autocomplete and returns `{ suggestions }`. Returns `401` if the user is not signed in.
* `POST /api/itineraryGenerator`: accepts JSON with `tripTitle`, `description`, `days`, and `country`, then returns a generated itinerary JSON object. Returns `400` if required fields are missing.

### Local Development and Testing

Start the development server with:

**npm run dev**

Then open `http://localhost:3000`.

Recommended local validation steps:

1. Sign up or log in with a demo account.  
2. Create a trip and verify the dashboard updates.  
3. Open a trip and add itinerary stops using place autocomplete.  
4. Confirm the map renders markers and route lines.  
5. Upload a document and verify it appears in the documents tab.  
6. Generate an AI itinerary and confirm the response renders correctly.

Static checks:

**npm run lint**

Production verification:

**npm run build**

## Deployment Information

**Live URL:** [https://journi-two.vercel.app](https://journi-two.vercel.app)  
**Deployment platform:** Vercel  
**Framework:** Next.js 16  
**Repository integration:** GitHub repository connected to Vercel for deployment

### Notes

* Environment variables are configured in Vercel for authentication, database access, cloud storage, Google Maps/Places integration, Unsplash image lookup, and Groq AI itinerary generation.  
* Prisma Client is generated during installation/build through the configured `postinstall` and `prebuild` scripts.

## Video Demo

The demo video showcases key features, user flow flow through the application, technical highlights, and deployment. 

**Video URL (Google Drive): [Demo Video](https://drive.google.com/file/d/1OOjVkG6SWO4vUHWm8pv13Y0PEfZyA_Uv/view?usp=sharing)** 

## AI Assistance & Verification (Summary)

We used AI selectively to support implementation after our team had already made the main architectural and design decisions. Its role was mainly to speed up some of our tasks such as debugging integration issues, generating boilerplate or repetitive code, and exploring UI variations. For example, we used AI when diagnosing the Prisma/Vercel build issue, thinking through Google Places autocomplete and place-details fetching for itinerary items, and shaping the AI itinerary generation flow so the response could be parsed and rendered safely. We also used AI for some frontend tasks such as helping redesign some pages, upgrade UI components, and suggest more modern fonts and styling directions. In those cases, we used the suggestions as starting points rather than final designs, then modified them to match what we wanted and kept only the parts that fit the project.

We did not treat AI output as something to copy directly into the project. In many cases, the first suggestion was too generic or did not fully fit our setup. For example, during deployment debugging, the discussion initially pointed partly toward import issues before we confirmed that the actual problem was Prisma client generation during new Vercel builds. In the feature related examples, suggestions also needed to be adapted to fit our server-side routes, authentication flow, and the data shape expected by the frontend.

All AI-assisted work was reviewed, understood, and, when necessary, modified by our team. We verified correctness through technical checks instead of relying on AI output alone. This included reviewing the relevant code paths, checking environment usage and build logs, running `npm run lint` and `npm run build`, and manually testing the main user flows in the browser. These flows included authentication, trip creation, Google Places search and itinerary item creation, map rendering, document upload, and AI itinerary generation. Some of the concrete examples are provided in `ai-session.md`.

## Individual Contributions

### Esam Uddin (`@esam191`)

Esam's work was mainly around authentication, the core trip flow, itinerary/map features, and shared UI improvements.

* **Authentication and app structure:** set up the initial auth flow with Better Auth, added the auth route groups, organized the landing/auth/dashboard structure, connected social login providers, and updated the auth pages using shadcn UI components.

* **Trip dashboard and trip creation flow:** built the full trip creation flow, including the “Add Trip” button in the navbar, the add trip form page, the server action for trip creation, Prisma integration, and the dashboard UI with summary cards and trip cards.

* **Trip details page:** created the dynamic trip details page, including the trip header/summary section and the tabs for itinerary and documents, as well as drag-and-drop reordering for itinerary items.

* **Itinerary and maps features:** implemented adding and deleting itinerary items, connected Google Places API for autocomplete and place details, and built the Google Maps tab with markers and route visualization.

### Iman Cheema (`@imancheema`)

Iman’s work focused on the landing page, trip editing/deletion, and document upload/delete support with cloud storage.

* **Landing page and branding:** built the landing page content and styling, and updated the navbar logo.  
    
* **Trip editing and deletion:** implemented the edit and delete trip flow, including the delete confirmation dialog, delete button, server-side trip update/delete logic, and the edit trip dialog.  
    
* **Document upload with DigitalOcean Spaces:** set up the AWS SDK / S3-compatible DigitalOcean Spaces client, added the upload API route, and implemented document upload in the app.  
    
* **Document deletion and metadata handling:** added the server action for deleting documents from both DigitalOcean Spaces and the database, and updated the save document action to store the "uploadedBy" field.

### Eraj Zaidi (`@erajz`)

Eraj’s work was mainly on frontend polish, auth page styling, trip imagery, and AI itinerary generation.

* **Automatic trip image generation:** implemented the trip image fetching through Unsplash, including the backend image route and the frontend wiring needed to display trip cover images on dashboard trip cards and the trip details page.

* **AI itinerary generation:** implemented the AI itinerary feature using Groq, including the API route, model integration, prompt/response handling, and the frontend UI for generating and displaying a day-by-day itinerary on the trip details page.

* **Authentication page styling:** improved the visual design of the sign-in and sign-up pages.

* **Frontend and usability improvements:** added the plane button that routes users back to the home page from the sign-in and sign-up pages, and contributed styling updates to the dashboard and add trip pages.

## Lessons Learned and Concluding Remarks

This project gave us a lot of confidence in turning our ideas into a successful, fully functional web application. It was rewarding to apply the concepts and skills we developed throughout the course to build a solution that addresses a problem we personally relate to.

Throughout the development process, we developed a stronger understanding of how to structure a full-stack application and organize our code using a Next.js full-stack architecture. This approach allowed us to handle both frontend and backend logic within the same framework and build a system that is scalable and maintainable. We also gained experience integrating external APIs, such as Google Maps, UnSplash, and Groq, allowing us to enhance the functionality of our application and improve the overall user experience. In addition, working with DigitalOcean Spaces for cloud storage gave us practical insights into handling file uploads and managing user data in a secure and efficient way.

Finally, one of the most important takeaways from this project was the importance of collaboration. We had regular meetings, divided tasks based on each member’s strengths and interests, and used Github for version control to collaborate efficiently. Overall, we successfully built the application we envisioned while strengthening our technical skills and gaining a better understanding of how real-world development teams operate.

[image1]: ./assets/1.png
[image2]: ./assets/2.png
[image3]: ./assets/3.1.png
[image4]: ./assets/3.2.png
[image5]: ./assets/3.3.png
[image6]: ./assets/4.1.png
[image7]: ./assets/4.2.png
[image8]: ./assets/5.1.png
[image9]: ./assets/5.2.png
[image10]: ./assets/6.1.png
[image11]: ./assets/7.1.png
