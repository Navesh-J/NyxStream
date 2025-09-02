# NyxStream

NyxStream is a modern video-sharing web application built with **Next.js**.  
It enables users to upload, stream, and manage videos with authentication and invoicing features.  

## 🚀 Features

- **Video Uploads**  
  - Authenticated users can upload videos through ImageKit.  
  - Metadata such as title, description, resolution, and file size is stored in MongoDB.  

- **Video Feed**  
  - Homepage displays all uploaded videos, sorted by newest first.  
  - Videos are streamed with HTML5 `<video>` for smooth playback.  

- **User Dashboard**  
  - Users can view all their uploaded videos.  
  - Option to delete videos they own.  

- **Authentication**  
  - Secured with **NextAuth**.  
  - Providers supported: **Google, GitHub, Email/Password**.  
  - Login required for uploading or deleting videos.  
  - Public browsing allowed for video feed.  

- **Invoices**  
  - Users can generate a **PDF invoice** of their uploaded videos.  
  - Invoice includes:
    - Invoice number and issue date  
    - Sender: NyxStream  
    - Receiver: User’s name and email  
    - Table with video details (ID, title, upload date, duration, size, resolution, views)  
    - Total number of videos + storage summary  
    - Professional footer note  

## 🛠 Tech Stack

- **Frontend & Backend:** [Next.js 13+ (App Router)](https://nextjs.org/)  
- **Database:** [MongoDB + Mongoose](https://www.mongodb.com/)  
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)  
- **Storage:** [ImageKit](https://imagekit.io/) for video upload/streaming  
- **Styling:** TailwindCSS  
- **PDF Generation:** jsPDF (client-side)  

## 📌 Future Improvements

- Migrate from ImageKit to **Supabase Storage** for chunked uploads and chunked streaming.  
- Enhanced video analytics (views, watch time, engagement).  
- User profiles and playlists.  
- Monetization and subscription features.  
- Improved video transcoding for multiple resolutions (480p, 720p, 1080p, 4K).  

---

💡 *Thank you for using NyxStream!*  
