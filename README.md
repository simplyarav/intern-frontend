

# KoinX Tax Loss Harvesting Assignment

This project is a modern, responsive, and pixel-perfect Tax Loss Harvesting interface built for the KoinX Frontend Intern Assignment.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Library:** React 18
- **Styling:** Tailwind CSS (Utility-first, customized for specific UI requirements)
- **Language:** TypeScript (Strict typing for components, hooks, and API data)
- **Icons:** Lucide React
- **API Mocking:** Next.js Serverless API Routes

## 🌟 Key Features & Bonus Points Completed

- **Pixel-Perfect UI:** Matched against the provided Figma designs and video screenshots, including exact hex codes, accordion animations, border radii, and SVG checkmarks.
- **Mobile Responsive:** Fluid flex-box scaling (`flex-col lg:flex-row`) and horizontally scrollable tables for cross-device support.
- **Built-in Mock API Server:** Utilized Next.js API Routes (`/api/holdings` & `/api/capital-gains`) to simulate a genuine backend architecture with artificial network delay. 
- **State Management:** Memoized math calculations and state updates are abstracted into a custom `useTaxLossHarvesting.ts` React Hook. 
- **Dynamic Tooltips & Number Formatting:** Formats large numbers using compact notation (e.g., `$16.79M`). Hovering over abbreviated numbers reveals the exact uncompacted value in a custom Tooltip.
- **Loading & Error States:** Provides a spinner during the simulated API fetch delay and fallback Error UI states.
- **Advanced Table Features:** Sortable table headers, sticky header row with hidden scrollbars, "View All" functionality, and custom indeterminate-state checkboxes. 

## 🛠️ Setup Instructions

Follow these simple steps to run the project locally.

1. **Navigate into the project directory:**
   ```bash
   cd frontend
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application!

## 📸 Screenshots

**1. Main Dashboard View:**

<img width="1920" height="1080" alt="Screenshot (1051)" src="https://github.com/user-attachments/assets/40e54b80-b73c-4d40-904f-1a4d08e05581" />

**2. Holdings Selected & After-Harvesting State Updated:**

<img width="1920" height="1080" alt="Screenshot (1054)" src="https://github.com/user-attachments/assets/b592b1d4-03ff-46c5-ab53-5bfb11a5f44c" />

## 🤔 Assumptions Made

1. **Tooltip Behavior:** The hover tooltip containing exact values applies to all abbreviated large numbers in the "Current Price", "Short-Term", and "Long-Term" columns. 
2. **Number Formatting Threshold:** Numbers $\ge$ $100,000 were abbreviated into compact `K` or `M` notation in the top cards (e.g., $16.79M), whereas smaller numbers like $4,049.48 remained exact. A `formatSmartCurrency` utility was implemented to replicate this threshold exactly.
3. **Deployment Strategy:** The initial Express.js backend mock data was migrated directly into Next.js built-in API routes. This satisfies the "API Mocking" requirement while keeping the repo as a monolithic, one-click deployable Vercel project without needing to configure CORS or host a separate backend server.
