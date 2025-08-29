# 🚀 Angular 20 Base Project

![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 📌 Overview

The **Angular 20 Base Project** is a modern, modular, and scalable SPA template designed to handle **user admissions, dashboards, and management functionalities**. It leverages Angular 20’s latest features, **modular architecture**, and **shared utilities** to provide a clean and maintainable codebase.

This project is ideal for:
- Any SPA requiring user management, admission workflows, and analytics

---

## ✨ Features

- **User Authentication**: Secure login, OTP verification, and password reset flows.  
- **Dashboard**: Modular dashboard with customizable widgets.  
- **Shared Directives**: Reusable directives for input validation, trimming, numeric-only fields, etc.  
- **Global Validations**: Centralized validators for forms and input handling.  
- **Modular Services**: Core services (`AuthService`, `ConfigService`, `ExcelService`) kept separate for reusability.  
- **Reusable Modals & Components**: Modal and spinner components are isolated and reusable across pages.  
- **Responsive Design**: Fully responsive with TailwindCSS.  
- **Real-time Updates**: Supports live notifications and status updates.  

---

## 🛠️ Tech Stack

- **Framework**: Angular 20  
- **Language**: TypeScript  
- **Styling**: TailwindCSS, SCSS  
- **State Management**: Optional NgRx integration  
- **Utilities & Libraries**:  
  - Angular CDK  
  - Ngx-Toastr  
  - Ngx-Daterangepicker-Material  
  - Ngx-Pagination
  - apexcharts
  - exceljs
  - jspdf
- **Testing**: Karma, Jasmine  
- **Linting & Formatting**: ESLint  
- **Containerization**: Docker  

---
## 📦 Installation

### Prerequisites
- Node.js (v14 or later)
- Angular CLI (v12 or later)
- Docker (optional)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/angular-codebase.git

# Navigate to the project directory
cd angular-codebase

# Install dependencies
npm install

# Build the project
npm run build

# Serve the project
npm run start
```

---
## 📁 Project Structure
```
angular-codebase/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── config.service.ts
│   │   │   ├── validators/
│   │   │   │   ├── global.validators.ts
│   │   │   ├── helpers/
│   │   │   │   ├── api-constants.ts
│   │   │   │   ├── constants.ts
│   │   │   │   ├── menu.ts
│   │   │   │   └── router-map.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── components/
│   │   │   │   ├── spinner/
│   │   │   │   │   └── spinner.component.ts
│   │   │   │   └── modal/
│   │   │   │       └── modal.component.ts
│   │   │   ├── pages/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/
│   │   │   │   │   │   ├── login.component.ts
│   │   │   │   │   │   └── login.component.html
│   │   │   │   │   ├── verify-otp/
│   │   │   │   │   │   ├── verify-otp.component.ts
│   │   │   │   │   │   └── verify-otp.component.html
│   │   │   │   │   └── reset-password/
│   │   │   │   │       ├── reset-password.component.ts
│   │   │   │   │       └── reset-password.component.html
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── dashboard.component.ts
│   │   │   │   │   └── dashboard.component.html
│   │   │   │   ├── users/
│   │   │   │   │   ├── users.component.ts
│   │   │   │   │   └── users.component.html
│   │   │   │   └── shared/
│   │   │   │       ├── _directives/
│   │   │   │       │   ├── alphanumeric-with-special.directive.ts
│   │   │   │       │   ├── app-only-numbers.directive.ts
│   │   │   │       │   └── trim-input.directive.ts
│   │   │   │       ├── _model/
│   │   │   │       │   └── shared.model.ts
│   │   │   │       ├── _pipes/
│   │   │   │       │   └── file-size.pipe.ts
│   │   │   │       ├── _services/
│   │   │   │       │   └── excel.service.ts
│   │   │   │       ├── action-menu/
│   │   │   │       │   ├── action-menu.component.ts
│   │   │   │       │   └── action-menu.component.html
│   │   │   │       ├── card/
│   │   │   │       │   ├── card.component.ts
│   │   │   │       │   └── card.component.html
│   │   │   │       └── table/
│   │   │   │           ├── table.component.ts
│   │   │   │           └── table.component.html
│   │   │   ├── app.component.ts
│   │   │   ├── app.component.html
│   │   │   ├── app.component.scss
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.service.ts
│   │   ├── index.html
│   │   └── main.ts
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── environments/
│   │   └── environment.ts
│   ├── styles.scss
│   └── index.html
├── .gitignore
├── Dockerfile
├── angular.json
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
└── README.md
```

## 🔧 Configuration
- **Environment Variables**: Configure environment variables in the `environment.ts` file.
- **Configuration Files**: Use the `angular.json` file to configure build settings.
- **Customization Options**: Modify the `tailwind.config.js` file to customize the design.

## 🤝 Contributing
- **Development Setup**: Clone the repository and install dependencies using `npm install`.
- **Code Style Guidelines**: Follow the TypeScript and Angular style guides.
- **Pull Request Process**: Ensure your code is well-tested and documented before submitting a pull request.

**Additional Guidelines:**
- Use modern markdown features (badges, collapsible sections, etc.)
- Include practical, working code examples
- Make it visually appealing with appropriate emojis
- Ensure all code snippets are syntactically correct for TypeScript
- Include relevant badges (build status, version, license, etc.)
- Make installation instructions copy-pasteable
- Focus on clarity and developer experience
