/**
 * LinkedIn Profile Parser
 * Parses LinkedIn profile data from manual input or structured text
 */

interface ParsedLinkedInData {
  fullName?: string;
  professionalTitle?: string;
  location?: string;
  linkedinUrl?: string;
  workExperience?: string;
  education?: string;
  skills?: string[];
}

/**
 * Parse manually pasted LinkedIn profile data
 * Supports various text formats from LinkedIn exports or copy-paste
 */
export function parseManualLinkedInData(manualData: string): ParsedLinkedInData {
  const result: ParsedLinkedInData = {};
  
  // Split into lines for processing
  const lines = manualData.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) {
    return result;
  }

  // Try to extract name (usually first line or after "Name:")
  const nameMatch = manualData.match(/(?:Name|Full Name):\s*(.+)/i);
  if (nameMatch) {
    result.fullName = nameMatch[1].trim();
  } else if (lines[0] && lines[0].length < 100 && !lines[0].includes(':')) {
    // First line is likely the name if it's short and has no colons
    result.fullName = lines[0];
  }

  // Extract headline/title
  const titleMatch = manualData.match(/(?:Headline|Title|Position):\s*(.+)/i);
  if (titleMatch) {
    result.professionalTitle = titleMatch[1].trim();
  }

  // Extract location
  const locationMatch = manualData.match(/(?:Location|City|Based in):\s*(.+)/i);
  if (locationMatch) {
    result.location = locationMatch[1].trim();
  }

  // Extract LinkedIn URL
  const urlMatch = manualData.match(/(?:linkedin\.com\/in\/[\w-]+|Profile URL:\s*(.+))/i);
  if (urlMatch) {
    const url = urlMatch[1] || urlMatch[0];
    result.linkedinUrl = url.startsWith('http') ? url : `https://linkedin.com/in/${url}`;
  }

  // Extract work experience section
  const expSection = extractSection(manualData, ['Experience', 'Work Experience', 'Employment']);
  if (expSection) {
    result.workExperience = formatWorkExperience(expSection);
  }

  // Extract education section
  const eduSection = extractSection(manualData, ['Education', 'Academic Background']);
  if (eduSection) {
    result.education = formatEducation(eduSection);
  }

  // Extract skills
  const skillsSection = extractSection(manualData, ['Skills', 'Technical Skills', 'Competencies']);
  if (skillsSection) {
    result.skills = parseSkills(skillsSection);
  }

  return result;
}

/**
 * Extract a section from the text based on headers
 */
function extractSection(text: string, headers: string[]): string | null {
  for (const header of headers) {
    // Look for section header (case insensitive)
    const regex = new RegExp(`${header}:?\\s*\\n([\\s\\S]*?)(?=\\n(?:[A-Z][a-z]+:)|$)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

/**
 * Format work experience into structured text
 */
function formatWorkExperience(expText: string): string {
  const lines = expText.split('\n').map(line => line.trim()).filter(line => line);
  const formatted: string[] = [];
  let currentJob: string[] = [];

  for (const line of lines) {
    // Check if line looks like a company or job title (usually short and capitalized)
    if (line.match(/^[A-Z]/) && line.length < 100 && !line.match(/^[•\-]/)) {
      if (currentJob.length > 0) {
        formatted.push(currentJob.join('\n') + '\n---\n');
        currentJob = [];
      }
      currentJob.push(line);
    } else {
      currentJob.push(line);
    }
  }

  // Add last job
  if (currentJob.length > 0) {
    formatted.push(currentJob.join('\n'));
  }

  return formatted.join('\n');
}

/**
 * Format education into structured text
 */
function formatEducation(eduText: string): string {
  const lines = eduText.split('\n').map(line => line.trim()).filter(line => line);
  const formatted: string[] = [];
  let currentEdu: string[] = [];

  for (const line of lines) {
    // Check if line looks like a school name or degree
    if (line.match(/^[A-Z]/) && line.length < 150 && !line.match(/^[•\-]/)) {
      if (currentEdu.length > 0) {
        formatted.push(currentEdu.join('\n') + '\n---\n');
        currentEdu = [];
      }
      currentEdu.push(line);
    } else {
      currentEdu.push(line);
    }
  }

  // Add last education entry
  if (currentEdu.length > 0) {
    formatted.push(currentEdu.join('\n'));
  }

  return formatted.join('\n');
}

/**
 * Parse skills from text into an array
 */
function parseSkills(skillsText: string): string[] {
  // Split by common separators
  const separators = /[,;•\n\|]/;
  const skills = skillsText
    .split(separators)
    .map(skill => skill.trim())
    .filter(skill => skill && skill.length > 1 && skill.length < 50);
  
  return skills;
}

/**
 * Validate LinkedIn URL format
 */
export function isValidLinkedInUrl(url: string): boolean {
  const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
  return linkedInPattern.test(url);
}

/**
 * Extract LinkedIn username from URL
 */
export function extractLinkedInUsername(url: string): string | null {
  const match = url.match(/linkedin\.com\/in\/([\w-]+)/);
  return match ? match[1] : null;
}
