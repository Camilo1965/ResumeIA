# LinkedIn Import Feature - Visual Demo

## Feature Location
The LinkedIn Import feature is accessible from:
- `/profiles/new` - When creating a new profile
- `/profiles/[id]` - When editing an existing profile

## UI Components

### 1. Import Button (Top of Profile Form)
```
┌─────────────────────────────────────────────────────────────────┐
│  [!] Import from LinkedIn                                       │
│                                                                 │
│  Quickly fill in your profile information by importing data    │
│  from your LinkedIn profile.                                   │
│                                                      [LinkedIn] │
│                                               [Import Button ►] │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Import Modal - Tab 1: Manual Paste
```
┌──────────────────────────────────────────────────────────────────┐
│  [LinkedIn Icon] Import from LinkedIn                        [X] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Manual Paste] [LinkedIn URL]                                  │
│  ═══════════════                                                 │
│                                                                  │
│  Paste your LinkedIn profile data:                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Name: Camilo Gonzalez                                    │   │
│  │ Headline: Senior Software Engineer                       │   │
│  │ Location: Piedecuesta, Santander, Colombia              │   │
│  │                                                          │   │
│  │ Experience:                                              │   │
│  │ Senior Software Engineer                                 │   │
│  │ TechCorp                                                 │   │
│  │ 2020 - Present                                           │   │
│  │ • Led development of cloud-native applications           │   │
│  │                                                          │   │
│  │ Education:                                               │   │
│  │ Universidad Industrial de Santander                      │   │
│  │ BS Computer Science                                      │   │
│  │ 2014 - 2018                                              │   │
│  │                                                          │   │
│  │ Skills: Kotlin, Android, AI/ML, React                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│                                    [Cancel] [Import Data ►]     │
└──────────────────────────────────────────────────────────────────┘
```

### 3. Import Modal - Tab 2: LinkedIn URL
```
┌──────────────────────────────────────────────────────────────────┐
│  [LinkedIn Icon] Import from LinkedIn                        [X] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Manual Paste] [LinkedIn URL]                                  │
│                  ═════════════                                   │
│                                                                  │
│  Paste your LinkedIn profile URL:                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ https://linkedin.com/in/camilo-gonzalez-93ba66396/      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Note: Due to LinkedIn restrictions, only the profile URL       │
│  will be saved. For complete data import, use Manual Paste.     │
│                                                                  │
│                                    [Cancel] [Import Data ►]     │
└──────────────────────────────────────────────────────────────────┘
```

### 4. Data Preview (After Parsing)
```
┌──────────────────────────────────────────────────────────────────┐
│  [LinkedIn Icon] Import from LinkedIn                        [X] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Preview Imported Data                                           │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [✓ Full Name]                                            │   │
│  │ Camilo Gonzalez                                          │   │
│  │                                                          │   │
│  │ [✓ Professional Title]                                   │   │
│  │ Senior Software Engineer                                 │   │
│  │                                                          │   │
│  │ [✓ Location]                                             │   │
│  │ Piedecuesta, Santander, Colombia                        │   │
│  │                                                          │   │
│  │ [✓ LinkedIn URL]                                         │   │
│  │ https://www.linkedin.com/in/camilo-gonzalez-93ba663...  │   │
│  │                                                          │   │
│  │ [✓ Work Experience]                                      │   │
│  │ Senior Software Engineer                                 │   │
│  │ TechCorp                                                 │   │
│  │ 2020 - Present                                           │   │
│  │ ...                                                      │   │
│  │                                                          │   │
│  │ [✓ Education]                                            │   │
│  │ Universidad Industrial de Santander                      │   │
│  │ BS Computer Science                                      │   │
│  │ ...                                                      │   │
│  │                                                          │   │
│  │ [✓ Skills]                                               │   │
│  │ Kotlin, Android, AI/ML, React                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│                              [Cancel] [Confirm & Import ►]      │
└──────────────────────────────────────────────────────────────────┘
```

### 5. Auto-Filled Profile Form
After clicking "Confirm & Import", all fields are automatically populated:
```
Profile Form (Auto-Filled)
├─ Full Name: "Camilo Gonzalez" ✓
├─ Professional Title: "Senior Software Engineer" ✓
├─ Phone: (needs manual entry)
├─ Email: (needs manual entry)
├─ Location: "Piedecuesta, Santander, Colombia" ✓
├─ LinkedIn: "https://www.linkedin.com/in/..." ✓
├─ Work Experience: (populated with formatted text) ✓
├─ Education: (populated with formatted text) ✓
└─ Skills: "Kotlin, Android, AI/ML, React" ✓
```

## User Flow

1. **Navigate** to Profiles → New Profile
2. **Click** "Import from LinkedIn" button (blue button with LinkedIn icon)
3. **Choose** import method:
   - Manual Paste: Copy/paste LinkedIn profile data
   - LinkedIn URL: Enter profile URL
4. **Enter** data and click "Import Data"
5. **Review** the preview showing all detected fields
6. **Click** "Confirm & Import" to auto-fill the form
7. **Complete** any remaining fields (phone, email)
8. **Save** the profile

## Color Coding

- **Green badges**: Successfully detected fields
- **Blue accents**: LinkedIn branding and interactive elements
- **Red alerts**: Error messages (if validation fails)

## Responsive Design

The modal is:
- Centered on screen
- Maximum width: 2xl (672px)
- Maximum height: 90vh with scroll
- Mobile-friendly with proper padding

## Accessibility

- Keyboard navigation supported
- Focus states on all interactive elements
- Clear labels and instructions
- Error messages are descriptive
