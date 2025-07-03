# Resume Generator WebApp

A modern, responsive web application for generating professional resumes with customizable templates and export options.

## Features

- **Modern UI/UX**: Clean, professional interface built with React and TypeScript
- **Multiple Templates**: Choose from various professional resume templates
- **Export Options**: Export to PDF, DOCX, and other formats
- **Real-time Preview**: See your resume as you build it
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Data Persistence**: Save your progress locally
- **Sharing**: Share your resume with a unique URL

## Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: CSS3 with modern layout techniques
- **Build Tool**: Create React App
- **Testing**: Jest and React Testing Library
- **Linting**: ESLint with TypeScript support
- **Version Control**: Git with conventional commits

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zt55699/resume-generator-webapp.git
cd resume-generator-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (use with caution)

## Project Structure

```
resume-generator-webapp/
├── public/                 # Static files
├── src/                   # Source code
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   ├── styles/           # CSS styles
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main App component
├── .env                  # Environment variables (not committed)
├── .env.example          # Environment variables example
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
├── README.md             # This file
└── tsconfig.json         # TypeScript configuration
```

## Environment Variables

The following environment variables can be configured:

- `REACT_APP_NAME`: Application name
- `REACT_APP_VERSION`: Application version
- `REACT_APP_API_URL`: API base URL
- `REACT_APP_ENABLE_ANALYTICS`: Enable/disable analytics
- `REACT_APP_DEBUG`: Enable/disable debug mode

See `.env.example` for a complete list of configurable options.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### Commit Message Convention

This project uses [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

## Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### GitHub Pages

This project is configured for easy deployment to GitHub Pages:

1. Build the project: `npm run build`
2. Deploy to GitHub Pages using your preferred method

## Security

- Environment variables are used for sensitive configuration
- No secrets are committed to the repository
- All dependencies are kept up to date
- Input validation and sanitization implemented

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Roadmap

- [ ] Advanced template customization
- [ ] Integration with LinkedIn API
- [ ] Multi-language support
- [ ] Cloud storage integration
- [ ] Collaborative editing
- [ ] Advanced export options

---

**Built with ❤️ using React and TypeScript**