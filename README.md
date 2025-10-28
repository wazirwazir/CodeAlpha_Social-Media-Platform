# 🎵 Muse - Social Media Platform

**Muse** is a full-stack social media platform where users can connect, share posts, follow others, like content, and engage through comments.  

This project was built as part of my **CodeAlpha Internship**, demonstrating my ability to design and implement both the **frontend and backend** of a functional web application using **Node.js**, **Express**, **PostgreSQL**, and **vanilla JavaScript**.

---

## 🚀 Live Demo

👉 **Frontend:** [Frontend](https://wazirwazir.github.io/CodeAlpha_Social-Media-Platform/index.html)  
👉 **Backend API:** [Backend](https://github.com/wazirwazir/Muse_API)

> ⚠️ **Please be patient on first load!**  
> The server is hosted on **Render’s free tier**, which may take up to **50 seconds to start** after inactivity.

---

## 🌟 Features

### 👤 User System
- Register and log in with a unique avatar automatically generated using the **RoboHash API**.
- User sessions persist through browser storage.

### 📝 Posts
- Create and view posts with content, author info, and timestamps.
- Display comment count and like count dynamically.

### 💬 Comments
- Add and display comments under each post.
- Comments appear instantly without page reloads.

### ❤️ Likes
- Like and unlike posts with smooth UI feedback.
- Like counts update in real time.

### 👥 Follows
- Follow or unfollow users directly from posts.
- Follow state reflects across all posts by that user.

### ⏰ Time Formatting
- Database timestamps are formatted into human-friendly “time ago” strings.

---

## 🧠 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | HTML, CSS (Tailwind), Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL with Knex.js |
| **Hosting** | Render (Backend), Vercel/Netlify (Frontend) |
| **API** | RoboHash for user avatars |

---

## 🧩 Database Overview

Muse uses six main tables for structure and relationships:

| Table | Purpose |
|--------|----------|
| `users` | Stores user data (name, email, avatar) |
|`login`  | Stores user data (email, hashed password)|
| `posts` | Contains all user posts |
| `comments` | User comments tied to specific posts |
| `post_likes` | Tracks which user liked which post |
| `followers` | Tracks follower/following relationships |


Each table uses **foreign keys** and **ON DELETE CASCADE** rules to maintain relational integrity.

---

## 📜 Project Summary

Muse showcases the essential elements of a modern social media app:
- Interactive frontend built with **vanilla JavaScript**
- RESTful backend API powered by **Express**
- Persistent relational data handled by **PostgreSQL**
- Dynamic features (likes, follows, comments) updating instantly in the UI

---

## 👨‍💻 Author

**Abidakun Wazir**  
📍 Lagos, Nigeria  
💼 CodeAlpha Internship Participant  


---

## ⚖️ License
This project is open-source under the **MIT License**.

---

> _“Muse is more than a platform — it’s a space to express, connect, and inspire.”_ 🎶
