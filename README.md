# Next.js Weather App

A full-stack weather application built with Next.js 16, TypeScript, Prisma, and Tailwind CSS.

![Weather App Screenshot](https://placehold.co/600x400?text=Weather+App+Preview)

## Features

- **Authentication**: Secure user registration and login (Email/Password) with NextAuth.js.
- **Real-time Weather**: Current weather and 10-day forecast using Open-Meteo API.
- **Interactive Map**: Dynamic map showing your location using Leaflet.
  - **Layers**: Switch between Street Map and Satellite view.
  - **Overlays**: Live Precipitation (Radar) and Cloud Cover (Satellite) from RainViewer.
- **Multiple Locations**: Save, manage, and switch between multiple locations worldwide.
- **Weather Widgets**: Customizable dashboard widgets for:
  - Hourly Forecast
  - Precipitation Probability
  - UV Index
  - Wind Speed & Direction
  - Air Quality (AQI)
  - Astronomy (Sunrise/Sunset)
- **User Preferences**:
  - Temperature Units (Fahrenheit/Celsius)
  - Theme (Light/Dark/System)
  - Widget Visibility
- **Responsive Design**: Fully responsive UI with dark mode support.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)
- **Radar Data**: [RainViewer API](https://www.rainviewer.com/api.html)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/weather-login-app.git
   cd weather-login-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**:
   ```bash
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Register**: Create a new account.
2. **Dashboard**: View weather for your current location.
3. **Add Locations**: Click the location dropdown -> "Add Location" to search and save cities.
4. **Settings**: Click the settings icon to toggle themes, units, and widgets.

## License

This project is licensed under the MIT License.
