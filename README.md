# 🛡️ IECS Enterprise — Distributed Eligibility & Claims Processing System

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge\&logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green?style=for-the-badge\&logo=springboot)](https://spring.io/projects/spring-boot)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker-blue?style=for-the-badge\&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🚀 Overview

**IECS Enterprise** is a **distributed microservices-based platform** designed to handle **health insurance eligibility determination and claims processing** at scale.

The system is built to support **multiple user roles (Citizens, Caseworkers, Admins)** while ensuring **high availability, scalability, and secure data processing**.

---

## 🎯 Problem Statement

Legacy insurance systems are:

* Monolithic and hard to scale
* Slow in processing eligibility & claims
* Difficult to maintain and extend

---

## 💡 Solution

IECS Enterprise solves these challenges using:

* **Microservices architecture** for modular scalability
* **Event-driven workflows** for decoupled processing
* **Centralized API Gateway** for routing & security
* **Role-based access control (RBAC)** for secure operations

👉 Result: **Faster processing, better scalability, and improved system reliability**

---

## 🏗️ High-Level Architecture

![Architecture Diagram](./iecs-frontend/public/assets/architecture.png)

---

## 🧩 Microservices Breakdown

| Service                            | Responsibility                                     |
| ---------------------------------- | -------------------------------------------------- |
| **User Service**                   | Authentication, authorization (JWT + OAuth2), RBAC |
| **Application Registration (AR)**  | Handles application lifecycle                      |
| **Data Collection (DC)**           | Captures demographic & financial data              |
| **Eligibility Determination (ED)** | Rule engine for benefit eligibility                |
| **Benefit Issuance (BI)**          | Processes and disburses benefits                   |
| **Notification Service**           | Handles alerts, inbox, communication               |

---

## 🔄 Request Flow (System Design)

1. User submits application via frontend
2. Request routed through **API Gateway**
3. Authentication handled via **User Service**
4. Data collected via **DC Service**
5. Eligibility evaluated by **ED Service**
6. Benefits processed via **BI Service**
7. Notifications sent asynchronously

---

## 🧠 System Design Decisions

### 1. Microservices Architecture

* Services are independently deployable
* Loose coupling between components

👉 Benefit: **Independent scaling + better maintainability**

---

### 2. API Gateway (Spring Cloud Gateway)

* Centralized routing layer
* Handles authentication, logging, rate limiting

👉 Benefit: **Simplified client interaction + security**

---

### 3. Service Discovery (Eureka)

* Dynamic service registration & lookup

👉 Benefit: **Resilience + flexibility in scaling**

---

### 4. Redis Caching

* Used for frequently accessed data

👉 Result: **Reduced latency + lower DB load**

---

### 5. PostgreSQL (Relational DB)

* Ensures strong consistency across services

👉 Trade-off:

* Less flexible than NoSQL
* But provides ACID guarantees

---

## 📈 Scalability Strategy

* Stateless services → horizontal scaling
* Load balancing via API Gateway
* Redis caching for hot data
* Containerized deployment using Docker

---

## ⚠️ Trade-offs

* Increased system complexity
* Inter-service communication overhead
* Data consistency challenges in distributed systems

---

## 🛡️ Security Model

* JWT-based authentication
* OAuth2 for SSO integration
* Role-Based Access Control (RBAC)
* HTTPS/TLS for secure communication

---

## ⚡ Key Features

* Multi-role system (Citizen, Caseworker, Admin)
* Real-time notifications & inbox
* Rule-based eligibility engine
* Modular microservices architecture
* Secure API communication

---

## 🛠️ Tech Stack

### Frontend

* React 18 (Vite)
* Tailwind CSS
* Framer Motion
* Context API (state management)

### Backend

* Spring Boot 3
* Spring Cloud (Gateway, Eureka)
* PostgreSQL + Hibernate
* Redis

### Infrastructure

* Docker & Docker Compose

---

## 📊 API Documentation

Swagger UI available when services are running:

| Service              | Endpoint                              |
| -------------------- | ------------------------------------- |
| API Gateway          | http://localhost:8080/swagger-ui.html |
| User Service         | http://localhost:8081/swagger-ui.html |
| Eligibility Service  | http://localhost:8082/swagger-ui.html |
| Notification Service | http://localhost:8083/swagger-ui.html |

---

## 📸 UI Showcase

### Dashboard

![Dashboard](./iecs-frontend/public/assets/screenshots/dashboard_home.png)

### Application Flow

![Application](./iecs-frontend/public/assets/screenshots/application_form.png)

### Notifications

![Notifications](./iecs-frontend/public/assets/screenshots/notification_inbox.png)

---

## 🧪 Testing Strategy

* Unit Testing: JUnit, Mockito
* Integration Testing: Spring Boot Test
* Frontend Testing: React Testing Library

---

## 🚦 Getting Started

### Frontend

```bash id="zgl32n"
cd iecs-frontend
npm install
npm run dev
```

### Full System (Docker)

```bash id="zk2h1c"
docker-compose up --build
```

---

## 🚀 Future Improvements

* Event-driven architecture using Kafka
* Saga pattern for distributed transactions
* Centralized logging (ELK Stack)
* Distributed tracing (Zipkin/Jaeger)

---

## 📌 Key Learnings

* Designing scalable microservices systems
* Handling distributed system challenges
* Implementing secure RBAC-based systems

---

## 👨‍💻 Author

**Arbaz Sayyad**
Full Stack Software Engineer
Java • Spring Boot • Microservices • Distributed Systems

* 🔗 https://www.linkedin.com/in/arbaz-sayyad/
* 💻 https://github.com/Arbaz4Sayyad

---

⭐ If you found this project useful, consider giving it a star!
