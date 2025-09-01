# Synapse.io 🎓

A comprehensive productivity dashboard that helps students and professionals manage their academic, career, and fitness goals all in one place.

## 🌟 Features

### 📚 Study Management
- **Academic Performance Tracking**: Real-time CGPA calculation with grade point mapping
- **Assignment Management**: Track upcoming assignments with due dates and priority indicators
- **Exam Scheduling**: Monitor upcoming exams with visual countdown timers
- **Grade Management**: Store and track academic grades across different subjects

### 💼 Career Development
- **Job Application Tracking**: Manage job applications with status updates
- **Assessment Scheduling**: Track upcoming interviews and assessments
- **Company Management**: Organize applications by company and position

### 🏋️ Fitness & Health
- **Workout Routine Management**: Create and manage custom workout routines
- **Weight & BMI Tracking**: Log weight entries with automatic BMI calculation
- **Progress Visualization**: Interactive charts showing BMI trends over time
- **Profile Management**: Store personal fitness metrics like height

### 🎨 Modern UI/UX
- **Dark Theme**: Sleek black interface with gradient accents
- **Responsive Design**: Optimized for desktop and mobile devices
- **Interactive Dashboard**: Real-time data updates and visual indicators
- **Intuitive Navigation**: Clean navigation with icon-based menu

## 📁 Project Structure

```
studysphere/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── fitness/              # Fitness-related endpoints
│   │   │   │   ├── profile/          # User profile management
│   │   │   │   ├── routines/         # Workout routines CRUD
│   │   │   │   └── weight/           # Weight logging CRUD
│   │   │   ├── study/                # Academic management endpoints
│   │   │   │   ├── assignments/      # Assignment management
│   │   │   │   ├── exams/            # Exam scheduling
│   │   │   │   └── grades/           # Grade tracking
│   │   │   └── work/                 # Career development endpoints
│   │   │       ├── assessments/      # Interview scheduling
│   │   │       └── jobs/             # Job application tracking
│   │   ├── gym/                      # Fitness dashboard page
│   │   ├── study/                    # Academic dashboard page
│   │   ├── work/                     # Career dashboard page
│   │   ├── layout.tsx                # Root layout with navigation
│   │   ├── page.tsx                  # Main dashboard (home)
│   │   └── globals.css               # Global styles
│   ├── components/                   # Reusable UI components
│   │   └── ui/                       # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── select.tsx
│   ├── (components)/                 # Page-specific components
│   │   └── navbar.tsx                # Navigation component
│   ├── (pages)/                      # Alternative page components
│   │   ├── Gym.tsx
│   │   ├── study.tsx
│   │   └── work.tsx
│   ├── lib/                          # Utility libraries
│   │   ├── db.ts                     # MongoDB connection
│   │   └── utils.ts                  # Helper functions
│   └── models/                       # Database models
│       ├── Assessment.ts             # Interview/assessment model
│       ├── Assignment.ts             # Academic assignment model
│       ├── Exam.ts                   # Exam model
│       ├── Grade.ts                  # Grade model
│       ├── JobApplication.ts         # Job application model
│       ├── UserProfile.ts            # User profile model
│       ├── WeightLog.ts              # Weight tracking model
│       ├── WorkoutRoutine.ts         # Workout routine model
│       └── index.ts                  # Model exports
├── public/                           # Static assets
│   └── logo.svg                      # Application logo
├── components.json                   # shadcn/ui configuration
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── next.config.ts                    # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studysphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/studysphere
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studysphere
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS

## 📊 API Endpoints

### Study Management
- `GET /api/study/grades` - Fetch all grades
- `GET /api/study/assignments` - Fetch assignments
- `GET /api/study/exams` - Fetch exams

### Career Development
- `GET /api/work/assessments` - Fetch assessments
- `GET /api/work/jobs` - Fetch job applications

### Fitness Tracking
- `GET /api/fitness/routines` - Fetch workout routines
- `POST /api/fitness/routines` - Create new routine
- `DELETE /api/fitness/routines` - Delete routine
- `GET /api/fitness/weight` - Fetch weight logs
- `POST /api/fitness/weight` - Add weight entry
- `DELETE /api/fitness/weight` - Delete weight entry
- `GET /api/fitness/profile` - Fetch user profile
- `POST /api/fitness/profile` - Update user profile

## 🤝 Contributing

We welcome contributions to StudySphere! Here's how you can help:

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all linting checks pass

### Areas for Contribution

- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **New Features**: Add new functionality
- 📱 **Mobile Optimization**: Improve mobile experience
- 🎨 **UI/UX Improvements**: Enhance the interface
- 📊 **Data Visualization**: Add more chart types
- 🔒 **Security**: Improve data security
- 📚 **Documentation**: Improve docs and examples

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

**Happy Learning and Growing! 🚀**
