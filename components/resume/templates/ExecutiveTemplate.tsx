import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVContent } from '@/types';
import { getSectionTitles } from '@/lib/section-titles';

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  topBar: {
    backgroundColor: '#1e3a5f',
    height: 40,
    width: '100%',
  },
  header: {
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  headerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 8,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 14,
    color: '#555555',
    letterSpacing: 1,
    marginBottom: 12,
  },
  headerContact: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.5,
  },
  divider: {
    borderBottom: '1 solid #c9a227',
    marginHorizontal: 40,
    marginBottom: 15,
  },
  content: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e3a5f',
    letterSpacing: 1,
    marginTop: 15,
    marginBottom: 8,
  },
  sectionUnderline: {
    borderBottom: '2 solid #c9a227',
    width: 80,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
    textAlign: 'justify',
    marginBottom: 15,
  },
  achievementItem: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
    marginBottom: 5,
    marginLeft: 15,
  },
  achievementBullet: {
    color: '#c9a227',
    marginRight: 5,
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
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  dateRange: {
    fontSize: 9,
    color: '#888888',
    fontStyle: 'italic',
  },
  roleTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#444444',
    marginBottom: 3,
  },
  roleDescription: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.5,
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.5,
    marginLeft: 12,
    marginBottom: 2,
  },
  technologies: {
    fontSize: 8,
    color: '#888888',
    marginTop: 4,
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
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  degree: {
    fontSize: 9,
    color: '#555555',
  },
  skillCategory: {
    marginBottom: 5,
  },
  skillCategoryText: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 8,
    marginRight: 3,
  },
});

interface ExecutiveTemplateProps {
  cvContent: CVContent;
  cvLanguage?: 'en' | 'es';
}

export const ExecutiveTemplate = ({ cvContent, cvLanguage = 'en' }: ExecutiveTemplateProps) => {
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

  // Extract key achievements from work experience
  const keyAchievements = cvContent.workExperienceList
    .slice(0, 2)
    .flatMap(exp => exp.achievements.slice(0, 2))
    .slice(0, 3);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Top Bar */}
        <View style={styles.topBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerName}>{cvContent.headerInfo.fullName.toUpperCase()}</Text>
          <Text style={styles.headerTitle}>{cvContent.headerInfo.professionalRole}</Text>
          <Text style={styles.headerContact}>
            📍 {cvContent.headerInfo.locationText} | 📞 {cvContent.headerInfo.phoneNumber}
            {'\n'}
            ✉️ {cvContent.headerInfo.emailAddress}
            {cvContent.headerInfo.linkedinUrl && (
              <Text> | 🔗 {cvContent.headerInfo.linkedinUrl}</Text>
            )}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.content}>
          {/* Executive Summary */}
          <Text style={styles.sectionTitle}>EXECUTIVE SUMMARY</Text>
          <View style={styles.sectionUnderline} />
          <Text style={styles.summaryText}>{parseBoldText(cvContent.professionalOverview)}</Text>

          {/* Key Achievements */}
          {keyAchievements.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>KEY ACHIEVEMENTS</Text>
              <View style={styles.sectionUnderline} />
              {keyAchievements.map((achievement, idx) => (
                <Text key={idx} style={styles.achievementItem}>
                  <Text style={styles.achievementBullet}>◆</Text> {parseBoldText(achievement)}
                </Text>
              ))}
            </>
          )}

          {/* Professional Experience */}
          {cvContent.workExperienceList.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
              <View style={styles.sectionUnderline} />
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
                      Technologies: {experience.relevantTechnologies.join(', ')}
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
              <View style={styles.sectionUnderline} />
              {cvContent.educationList.map((edu, idx) => (
                <View key={idx} style={styles.educationItem}>
                  <View style={styles.educationHeader}>
                    <Text style={styles.institutionName}>🎓 {edu.institutionName}</Text>
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
              <View style={styles.sectionUnderline} />
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
        </View>
      </Page>
    </Document>
  );
};
