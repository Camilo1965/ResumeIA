# ATS (Applicant Tracking System) Feature

## Overview

The ATS feature analyzes resume compatibility with Applicant Tracking Systems and provides actionable recommendations to improve your resume's chances of passing automated screening.

## Features

### 1. Automatic ATS Analysis
- Every generated CV is automatically analyzed for ATS compatibility
- Score is calculated based on multiple factors (0-100)
- Results are saved with each CV in the database

### 2. Comprehensive Scoring System

The ATS score is calculated based on five key categories:

| Category | Weight | Description |
|----------|--------|-------------|
| Keyword Match | 30% | Matches keywords from job description with CV content |
| Format Score | 20% | Evaluates ATS-friendly formatting (sections, headers, structure) |
| Experience Relevance | 25% | Analyzes quality of work experience (metrics, action verbs, detail) |
| Skills Match | 15% | Compares required skills with listed skills |
| Education | 10% | Validates education section completeness |

### 3. Score Interpretation

- **90-100 (Excellent)**: ✅ Green - Your resume is highly optimized for ATS
- **70-89 (Good)**: ⚠️ Yellow - Your resume is good but has room for improvement
- **50-69 (Needs Improvement)**: ⚠️ Orange - Significant improvements needed
- **0-49 (Critical Issues)**: ❌ Red - Major issues that need immediate attention

### 4. Detailed Analysis Panel

The analysis panel provides:
- Overall score with visual progress bar
- Breakdown of each scoring category
- List of found vs. missing keywords
- Specific, actionable recommendations
- Option to apply suggestions (coming soon)

### 5. History Tracking

- ATS scores are displayed in the CV history table
- Visual badges show score status at a glance
- Track improvement over multiple CV versions

## API Endpoints

### POST `/api/ats/analyze`

Analyzes a CV for ATS compatibility.

**Request:**
```json
{
  "cvContent": {
    "headerInfo": { ... },
    "professionalOverview": "...",
    "workExperienceList": [...],
    "educationList": [...],
    "skillCategories": [...]
  },
  "jobRequirements": "Job description text..."
}
```

**Response:**
```json
{
  "overallScore": 87,
  "breakdown": {
    "keywordMatch": { "score": 25, "max": 30, "details": [...] },
    "formatScore": { "score": 20, "max": 20, "details": [...] },
    "experienceRelevance": { "score": 17, "max": 25, "details": [...] },
    "skillsMatch": { "score": 15, "max": 15, "details": [...] },
    "education": { "score": 10, "max": 10, "details": [...] }
  },
  "keywords": {
    "found": ["Python", "React", "AWS"],
    "missing": ["Docker", "Kubernetes"],
    "optional": []
  },
  "recommendations": [
    "Add Docker to your skills if applicable",
    "Include more quantifiable achievements"
  ]
}
```

## Components

### UI Components

- **`ATSScoreBadge`**: Displays the ATS score with color-coded badge
- **`ATSAnalysisPanel`**: Full-screen panel with detailed analysis
- **`CVPreviewPanel`**: Updated to show ATS badge

### Backend

- **`lib/ats-analyzer.ts`**: Core ATS analysis logic
- **`app/api/ats/analyze/route.ts`**: API endpoint for analysis
- **`app/api/ats/improve/route.ts`**: API endpoint for improvements (placeholder)

## Usage

### Tips for Better ATS Scores

When entering job requirements:
- ✅ Copy the complete job description
- ✅ Include all mentioned technologies
- ✅ Use the same keywords as the posting
- ❌ Avoid non-standard abbreviations

## Database Schema

The `GeneratedCV` model includes:
```prisma
model GeneratedCV {
  // ... existing fields
  atsScore          Int?
  atsAnalysis       String?       @db.Text
  // ...
}
```

## Technical Details

### Keyword Extraction

The analyzer uses regex patterns to extract:
- Programming languages (JavaScript, Python, Java, etc.)
- Frameworks & libraries (React, Django, Spring, etc.)
- Databases (PostgreSQL, MongoDB, etc.)
- Cloud & DevOps tools (AWS, Docker, Kubernetes, etc.)
- AI/ML technologies
- Soft skills (leadership, communication, etc.)
- Certifications
- Years of experience

### Scoring Algorithm

Each category is scored independently:

1. **Keyword Match**: Percentage of job keywords found in CV × 30
2. **Format Score**: Checklist of standard sections and formatting (max 20)
3. **Experience Relevance**: Evaluates metrics, action verbs, technologies (max 25)
4. **Skills Match**: Comprehensiveness and job alignment (max 15)
5. **Education**: Completeness of education information (max 10)

Total score = Sum of all category scores (0-100)

## License

Part of the ResumeIA project.
