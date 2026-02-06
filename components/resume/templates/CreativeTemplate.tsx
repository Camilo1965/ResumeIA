import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVContent } from '@/types';
import { getSectionTitles } from '@/lib/section-titles';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: '#667eea',
    borderRadius: 35,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 8,
  },
  headerDivider: {
    borderBottom: '2 solid #06B6D4',
    marginTop: 5,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  leftColumn: {
    width: '35%',
  },
  rightColumn: {
    width: '65%',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardUnderline: {
    borderBottom: '1 solid #06B6D4',
    width: 30,
    marginBottom: 8,
  },
  contactItem: {
    fontSize: 8,
    color: '#555555',
    marginBottom: 4,
    lineHeight: 1.5,
  },
  aboutText: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.5,
  },
  skillItem: {
    marginBottom: 6,
  },
  skillName: {
    fontSize: 8,
    color: '#555555',
    marginBottom: 2,
  },
  skillBar: {
    flexDirection: 'row',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  skillBarFilled: {
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  sectionUnderline: {
    borderBottom: '1 solid #06B6D4',
    width: 40,
    marginBottom: 10,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    marginBottom: 3,
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  roleTitle: {
    fontSize: 9,
    color: '#667eea',
    marginBottom: 2,
  },
  dateRange: {
    fontSize: 8,
    color: '#888888',
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 8,
    color: '#555555',
    lineHeight: 1.5,
    marginLeft: 10,
    marginBottom: 2,
  },
  technologies: {
    fontSize: 7,
    color: '#888888',
    marginTop: 3,
  },
  educationItem: {
    marginBottom: 8,
  },
  institutionName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333333',
  },
  degree: {
    fontSize: 8,
    color: '#555555',
  },
  eduDateRange: {
    fontSize: 7,
    color: '#888888',
    marginTop: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
});

interface CreativeTemplateProps {
  cvContent: CVContent;
  cvLanguage?: 'en' | 'es';
}

export const CreativeTemplate = ({ cvContent, cvLanguage = 'en' }: CreativeTemplateProps) => {
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

  // Calculate skill percentages (mock for display)
  const getSkillPercentage = (index: number) => {
    const percentages = [85, 90, 75, 80, 70];
    return percentages[index % percentages.length];
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{cvContent.headerInfo.fullName}</Text>
              <Text style={styles.headerTitle}>{cvContent.headerInfo.professionalRole}</Text>
              <View style={styles.headerDivider} />
            </View>
          </View>
        </View>

        {/* Two Column Layout */}
        <View style={styles.twoColumnContainer}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Contact Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{titles.contact}</Text>
              <View style={styles.cardUnderline} />
              <Text style={styles.contactItem}>📞 {cvContent.headerInfo.phoneNumber}</Text>
              <Text style={styles.contactItem}>✉️ {cvContent.headerInfo.emailAddress}</Text>
              <Text style={styles.contactItem}>📍 {cvContent.headerInfo.locationText}</Text>
              {cvContent.headerInfo.linkedinUrl && (
                <Text style={styles.contactItem}>🔗 LinkedIn</Text>
              )}
            </View>

            {/* Skills Card */}
            {cvContent.skillCategories.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{titles.skills}</Text>
                <View style={styles.cardUnderline} />
                {cvContent.skillCategories.slice(0, 5).flatMap((category, catIdx) => 
                  category.skillsList.slice(0, 2).map((skill, skillIdx) => {
                    const percentage = getSkillPercentage(catIdx * 2 + skillIdx);
                    return (
                      <View key={`${catIdx}-${skillIdx}`} style={styles.skillItem}>
                        <Text style={styles.skillName}>{skill}</Text>
                        <View style={styles.skillBar}>
                          <View style={[styles.skillBarFilled, { width: `${percentage}%` }]} />
                        </View>
                      </View>
                    );
                  })
                ).slice(0, 5)}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* About Me */}
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>{titles.aboutMe}</Text>
              <View style={styles.sectionUnderline} />
              <Text style={styles.aboutText}>{parseBoldText(cvContent.professionalOverview)}</Text>
            </View>

            {/* Experience */}
            {cvContent.workExperienceList.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>{titles.experience}</Text>
                <View style={styles.sectionUnderline} />
                {cvContent.workExperienceList.map((experience, idx) => (
                  <View key={idx} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.companyName}>{experience.companyName} - {experience.roleTitle}</Text>
                      <Text style={styles.dateRange}>{experience.dateRange}</Text>
                    </View>
                    {experience.achievements.slice(0, 3).map((achievement, achIdx) => (
                      <Text key={achIdx} style={styles.bulletPoint}>
                        • {parseBoldText(achievement)}
                      </Text>
                    ))}
                    {experience.relevantTechnologies.length > 0 && (
                      <Text style={styles.technologies}>
                        {experience.relevantTechnologies.slice(0, 5).join(' • ')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Education - Full Width at Bottom */}
        {cvContent.educationList.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{titles.education}</Text>
            <View style={styles.sectionUnderline} />
            {cvContent.educationList.map((edu, idx) => (
              <View key={idx} style={styles.educationItem}>
                <Text style={styles.institutionName}>🎓 {edu.institutionName} - {edu.degreeObtained}</Text>
                <Text style={styles.eduDateRange}>{edu.dateRange}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
