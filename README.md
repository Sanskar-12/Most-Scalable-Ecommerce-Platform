# E-Commerce Website

An E-Commerce Website built using the **MERN Stack** with the following technologies:

- **TypeScript** for type-safe development.
- **Express.js** for backend server.
- **Redis** for caching.
- **Docker** for containerization.

---

## Features

- **Frontend**: Built with React and TypeScript.
- **Backend**: Built with Express.js and TypeScript.
- **Caching**: Integrated with Redis for improved performance.
- **Database**: MongoDB for data persistence.
- **Containerization**: Dockerized for easy deployment and scalability.
- **Firebase Auth** for Google Auth.

---

## Screenshots

### Homepage

![image](https://github.com/user-attachments/assets/5092466f-f501-4f63-a55f-8ae06e50cb0e)

### Login/Signup Page

![image](https://github.com/user-attachments/assets/b99d1c8c-bd76-4f13-8aa1-c07152ab4b1a)

### Product Details Page

![image](https://github.com/user-attachments/assets/f0649c68-a45c-4986-965a-c58e7465c13c)

### Review Section

![image](https://github.com/user-attachments/assets/fc3ee56e-77f4-43f5-b9a9-245ea54a1778)
![image](https://github.com/user-attachments/assets/ecb37241-e8a2-4e55-9972-ab68120f9b6b)

### Search Page

![image](https://github.com/user-attachments/assets/089c5e40-1dd5-4c43-98b0-79daf45d2703)

### Cart Page

![image](https://github.com/user-attachments/assets/bbb7c56d-7847-408b-800a-610f7ad25956)

### Payment Page ( Stripe )

![image](https://github.com/user-attachments/assets/3c2fee14-330b-4634-86ed-b4a122ca2b19)

### Order info Page

![image](https://github.com/user-attachments/assets/885d17ec-8f99-476d-8914-e8b065a848a9)

### Admin Dashboard Page

![image](https://github.com/user-attachments/assets/801b60d8-389b-4519-b054-aceb386dbb40)

### Product, Order, Coupon Management Page

![image](https://github.com/user-attachments/assets/f67b7889-715f-4f31-87ad-b4de78b88536)
![image](https://github.com/user-attachments/assets/35ccd3fc-9ac4-44a7-ad1f-084ecf6ec6df)
![image](https://github.com/user-attachments/assets/6099932a-7e79-4db2-b8da-7f71f6a868e2)

### Bar, Pie, Line Chart Page

![image](https://github.com/user-attachments/assets/58a43dfc-daf1-4feb-8a34-596e2ca593a9)
![image](https://github.com/user-attachments/assets/86ebd0fd-c7ed-4731-929b-d33641fe23ff)
![image](https://github.com/user-attachments/assets/b54730af-a33c-44d1-83fd-05928420f2a0)

---

## Setting Up the Project

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (>= 16.x)
- Docker
- MongoDB

---

### Steps

1. **Clone the Repository**:

   ```bash
   https://github.com/Sanskar-12/Most-Scalable-Ecommerce-Platform.git

   ```

2. **Setup the backend env and node modules**:

   ```bash
   cd backend
   npm install
   ```

   Make the .env file inside the root directory of backend and copy the .env.example and set up all of your envs

3. **Setup the frontend env**:
   ```bash
   cd frontend
   npm install
   ```
   Make the .env file inside the root directory of frontend and copy the .env.example and set up all of your envs
4. **Start the app with docker**:

   ```bash
   cd ..
   docker compose up -d
   ```

   OR

   ```bash
   cd ..
   docker compose watch

   ```

5. **Another way to Start the backend**:
   ```bash
   cd backend
   npm run watch
   npm run dev // on another terminal
   ```
6. **Another way to Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
