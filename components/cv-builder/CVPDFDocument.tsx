import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVContent } from '@/types';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    borderBottom: '4 solid #D4A017',
    paddingBottom: 10,
    marginBottom: 15,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D9488',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D9488',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerContact: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    borderBottom: '2 solid #D4A017',
    paddingBottom: 3,
    marginTop: 12,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
    textAlign: 'justify',
    marginBottom: 12,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  dateRange: {
    fontSize: 9,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  roleTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0D9488',
    marginBottom: 3,
  },
  roleDescription: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
    marginLeft: 15,
    marginBottom: 3,
  },
  technologies: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 5,
  },
  educationItem: {
    marginBottom: 8,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  institutionName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  degree: {
    fontSize: 10,
    color: '#374151',
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCategoryText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

interface CVPDFDocumentProps {
  cvContent: CVContent;
}

// Export the Document component directly
export const CVPDFDocument = ({ cvContent }: CVPDFDocumentProps) => {
  // Helper function to parse bold text
  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={index} style={styles.bold}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerName}>{cvContent.headerInfo.fullName}</Text>
          <Text style={styles.headerTitle}>
            {cvContent.headerInfo.professionalRole.toUpperCase()}
          </Text>
          <Text style={styles.headerContact}>
            {cvContent.headerInfo.locationText} | {cvContent.headerInfo.phoneNumber} |{' '}
            {cvContent.headerInfo.emailAddress}
            {cvContent.headerInfo.linkedinUrl && (
              <Text>{'\n'}{cvContent.headerInfo.linkedinUrl}</Text>
            )}
          </Text>
        </View>

        {/* Professional Summary */}
        <Text style={styles.sectionTitle}>SUMMARY</Text>
        <Text style={styles.summaryText}>{parseBoldText(cvContent.professionalOverview)}</Text>

        {/* Professional Experience */}
        {cvContent.workExperienceList.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            {cvContent.workExperienceList.map((experience, idx) => (
              <View key={idx} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.companyName}>{experience.companyName}</Text>
                  <Text style={styles.dateRange}>{experience.dateRange}</Text>
                </View>
                <Text style={styles.roleTitle}>{experience.roleTitle}</Text>
                <Text style={styles.roleDescription}>
                  {parseBoldText(experience.roleDescription)}
                </Text>
                {experience.achievements.map((achievement, achIdx) => (
                  <Text key={achIdx} style={styles.bulletPoint}>
                    • {parseBoldText(achievement)}
                  </Text>
                ))}
                {experience.relevantTechnologies.length > 0 && (
                  <Text style={styles.technologies}>
                    Skills: {experience.relevantTechnologies.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Education */}
        {cvContent.educationList.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {cvContent.educationList.map((edu, idx) => (
              <View key={idx} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.institutionName}>{edu.institutionName}</Text>
                  <Text style={styles.dateRange}>{edu.dateRange}</Text>
                </View>
                <Text style={styles.degree}>{edu.degreeObtained}</Text>
              </View>
            ))}
          </>
        )}

        {/* Professional Skills */}
        {cvContent.skillCategories.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>PROFESSIONAL SKILLS</Text>
            {cvContent.skillCategories.map((category, idx) => (
              <View key={idx} style={styles.skillCategory}>
                <Text style={styles.skillCategoryText}>
                  <Text style={styles.bold}>• {category.categoryName}:</Text>{' '}
                  {category.skillsList.join(', ')}
                </Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
};

