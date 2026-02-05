import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVContent } from '@/types';
import { getSectionTitles } from '@/lib/section-titles';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
  },
  headerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerTitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  headerContact: {
    fontSize: 9,
    color: '#888888',
    lineHeight: 1.5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.8,
    marginBottom: 15,
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  dateRange: {
    fontSize: 9,
    color: '#888888',
  },
  roleTitle: {
    fontSize: 10,
    color: '#555555',
    marginBottom: 5,
  },
  roleDescription: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.6,
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.6,
    marginLeft: 10,
    marginBottom: 3,
  },
  technologies: {
    fontSize: 8,
    color: '#999999',
    marginTop: 5,
  },
  educationItem: {
    marginBottom: 10,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  institutionName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  degree: {
    fontSize: 9,
    color: '#666666',
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillCategoryText: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.6,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  accentDot: {
    color: '#0D9488',
    marginRight: 3,
  },
});

interface MinimalistTemplateProps {
  cvContent: CVContent;
  cvLanguage?: 'en' | 'es';
}

export const MinimalistTemplate = ({ cvContent, cvLanguage = 'en' }: MinimalistTemplateProps) => {
  const titles = getSectionTitles(cvLanguage, 'short');
  
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
          <Text style={styles.headerTitle}>{cvContent.headerInfo.professionalRole}</Text>
          <Text style={styles.headerContact}>
            {cvContent.headerInfo.locationText}  ·  {cvContent.headerInfo.phoneNumber}  ·  {cvContent.headerInfo.emailAddress}
            {cvContent.headerInfo.linkedinUrl && (
              <Text>
                {'\n'}
                {cvContent.headerInfo.linkedinUrl.startsWith('http') 
                  ? cvContent.headerInfo.linkedinUrl 
                  : `https://${cvContent.headerInfo.linkedinUrl}`}
              </Text>
            )}
          </Text>
        </View>

        {/* Professional Summary */}
        <Text style={styles.sectionTitle}>{titles.summary}</Text>
        <Text style={styles.summaryText}>{parseBoldText(cvContent.professionalOverview)}</Text>

        {/* Professional Experience */}
        {cvContent.workExperienceList.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{titles.experience}</Text>
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
                    <Text style={styles.accentDot}>•</Text> {parseBoldText(achievement)}
                  </Text>
                ))}
                {experience.relevantTechnologies.length > 0 && (
                  <Text style={styles.technologies}>
                    {experience.relevantTechnologies.join('  ·  ')}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Education */}
        {cvContent.educationList.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{titles.education}</Text>
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
            <Text style={styles.sectionTitle}>{titles.skills}</Text>
            {cvContent.skillCategories.map((category, idx) => (
              <View key={idx} style={styles.skillCategory}>
                <Text style={styles.skillCategoryText}>
                  <Text style={styles.bold}>{category.categoryName}</Text>
                  {'  '}
                  {category.skillsList.join('  ·  ')}
                </Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
};
