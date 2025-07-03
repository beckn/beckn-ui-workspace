import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Index.module.css'

const Index: React.FC = () => {
  const router = useRouter()

  const quickStats = [
    { label: 'Total Users', value: '1,234', icon: '👥' },
    { label: 'Active Networks', value: '56', icon: '🌐' },
    { label: 'System Health', value: '99.9%', icon: '✅' }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to the Registry</h1>

        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <p className={styles.welcomeText}>
            Manage your Beckn network participants, users, and configurations with our comprehensive registry dashboard.
          </p>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>System Overview</h2>
          <div className={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className={styles.statCard}
              >
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className={styles.quickAccess}>
          <h2 className={styles.sectionTitle}>Quick Access</h2>
          <div className={styles.accessGrid}>
            <button
              className={styles.accessCard}
              onClick={() => router.push('/users')}
            >
              <span className={styles.accessIcon}>👥</span>
              <span className={styles.accessText}>Manage Users</span>
            </button>
            <button
              className={styles.accessCard}
              onClick={() => router.push('/networkParticipants')}
            >
              <span className={styles.accessIcon}>🌐</span>
              <span className={styles.accessText}>Network Participants</span>
            </button>
            <button
              className={styles.accessCard}
              onClick={() => router.push('/networkDomains')}
            >
              <span className={styles.accessIcon}>🏢</span>
              <span className={styles.accessText}>Network Domains</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
