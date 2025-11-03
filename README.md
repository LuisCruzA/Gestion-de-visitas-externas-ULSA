# Sistema gestion de visitas ULSA

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![GitFlow](https://img.shields.io/badge/GitFlow-Workflow-F05032?logo=git&logoColor=white)

> A **School Visits Management System** built with Next.js, Prisma, PostgreSQL, and TailwindCSS, demonstrating best practices, clean architecture, and GitFlow workflow.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)
* [Frontend (Atomic Design)](#frontend-atomic-design)
* [Data Model](#data-model)
* [Quick Start](#quick-start)
  * [Clone Repository](#clone-repository)
  * [Run PostgreSQL with Docker](#run-postgresql-with-docker)
  * [Environment Setup](#environment-setup)
  * [Install Dependencies & Run](#install-dependencies--run)
* [GitFlow Workflow](#gitflow-workflow)
* [Useful Commands](#useful-commands)
* [Project Structure](#project-structure)
* [Design Decisions & Trade‑offs](#design-decisions--trade-offs)

---

## Overview

📚 **Admin System:** users can submit visit details, view status, and reasign visits.  

🛠️ **Admin University:** users can submit visit details, view status 

Goal: demonstrate **server/client separation** (Next.js App Router + API Routes), proper **validation**, **persistence** using PostgreSQL, and **team workflow** with GitFlow.

---

## Features

* ✅ Public project submission form
* ✅ Admin panel: list, search, filter, pagination
* ✅ Assign/clear **visit dates**
* ✅ PostgreSQL persistence via Prisma ORM
* ✅ Tables designed with simplicity 

---

## Architecture



* **Server logic** in Route Handlers and DB access (Prisma).  
* **Client logic** (forms, table actions) in client components.

---

## Tech Stack

* **Next.js (App Router)** — server/client split, API routes  
* **TypeScript** — safer code & IDE autocompletion  
* **TailwindCSS** — responsive styling  
* **PostgreSQL** — relational database  
* **Prisma ORM** — schema, type-safe queries, migrations  
* **Docker** — containerized DB setup  
* **GitFlow** — collaborative workflow

---

 

---


## Quick Start

### Clone Repository

bash
git clone -b main <repository-url>
cd <project-folder>



##Run PostgreSQL with Docker
# docker-compose.yml included in repo
docker compose up -d



npm install
npm i -D prisma
npm i @prisma/client zod

# Prisma setup
npx prisma generate
npx prisma migrate dev --name init

# Run app
npm run dev
# Public form: http://localhost:3000
# Admin panel: http://localhost:3000/gestion


#GitFlow Workflow

Main branch: stable production-ready code

Develop branch: integration for features

Feature branches: feature/<name>

Release branches: release/<version>

Hotfix branches: hotfix/<issue>

# Example workflow
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
# ... make changes ...
git commit -am "Add new feature"
git push origin feature/new-feature
# Merge via Pull Request into develop


Useful Commands
Task	Command
Start DB (Docker)	docker compose up -d
Stop DB	docker compose down
Reset DB volume ⚠️	docker compose down -v && docker compose up -d
Prisma generate	npx prisma generate
Prisma migrate	npx prisma migrate dev --name <name>
Prisma Studio (DB UI)	npx prisma studio
Dev server	npm run dev

Design Decisions & Trade‑offs

Next.js App Router for clear server/client split and built-in API routes

Prisma ORM for type-safe queries & migrations

Docker for easy local DB setup

Atomic Design for reusable frontend components

GitFlow for structured team workflow


