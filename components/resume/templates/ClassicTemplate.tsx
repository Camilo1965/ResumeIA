import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVContent } from '@/types';
import { getSectionTitles } from '@/lib/section-titles';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2 solid #333333',
  },
  headerName: {
    fontSize: 22,
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 6,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: 'Times-Italic',
    color: '#333333',
    marginBottom: 8,
  },
  headerContact: {
    fontSize: 10,
    color: '#555555',
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Times-Bold',
    color: '#000000',
    borderBottom: '1 solid #555555',
    paddingBottom: 2,
    marginTop: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 11,
    color: '#333333',
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
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  dateRange: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    color: '#666666',
  },
  roleTitle: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    color: '#333333',
    marginBottom: 3,
  },
  roleDescription: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.5,
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.5,
    marginLeft: 20,
    marginBottom: 3,
  },
  technologies: {
    fontSize: 9,
    fontFamily: 'Times-Italic',
    color: '#666666',
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
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  degree: {
    fontSize: 10,
    color: '#444444',
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCategoryText: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.5,
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  decorativeLine: {
    borderTop: '1 solid #CCCCCC',
    marginVertical: 10,
  },
});

interface ClassicTemplateProps {
  cvContent: CVContent;
  cvLanguage?: 'en' | 'es';
}

export const ClassicTemplate = ({ cvContent, cvLanguage = 'en' }: ClassicTemplateProps) => {
  const titles = getSectionTitles(cvLanguage);
  
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
            {cvContent.headerInfo.locationText} • {cvContent.headerInfo.phoneNumber} • {cvContent.headerInfo.emailAddress}
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

        <View style={styles.decorativeLine} />

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
                    • {parseBoldText(achievement)}
                  </Text>
                ))}
                {experience.relevantTechnologies.length > 0 && (
                  <Text style={styles.technologies}>
                    Technical Skills: {experience.relevantTechnologies.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}

        <View style={styles.decorativeLine} />

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

        <View style={styles.decorativeLine} />

        {/* Professional Skills */}
        {cvContent.skillCategories.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{titles.skills}</Text>
            {cvContent.skillCategories.map((category, idx) => (
              <View key={idx} style={styles.skillCategory}>
                <Text style={styles.skillCategoryText}>
                  <Text style={styles.bold}>{category.categoryName}:</Text>{' '}
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
