pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/sanidhyayadav01/BW_HF_Automation.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Verify Cypress') {
            steps {
                bat 'npx cypress verify'
            }
        }

        stage('Run Cypress Tests') {
            steps {
                bat 'npx cypress run'
            }
        }

        stage('Publish Allure Report') {
            steps {
                allure([
                    includeProperties: false,
                    jdk: '',
                    results: [[path: 'allure-results']]
                ])
            }
        }
    }

    post {
        always {
            // 📦 Archive reports + screenshots + videos
            archiveArtifacts artifacts: '''
                allure-results/**,
                allure-report/**,
                cypress/screenshots/**,
                cypress/videos/**
            ''', fingerprint: true

            echo 'Pipeline execution completed.'
        }

        success {
            emailext(

                // 📧 EMAIL SUBJECT
                subject: "✔ BW Automation SUCCESS - ${currentBuild.fullDisplayName}",

                // 📧 EMAIL BODY
                body: """
Cypress Execution Completed Successfully

Build URL:
${env.BUILD_URL}

Allure Report:
${env.BUILD_URL}allure
""",

                // 👇 PRIMARY RECEIVER (TO)
                to: 'syadav@trueigtech.com',

                // ==========================================
                // 👥 MULTIPLE TO RECIPIENTS (UNCOMMENT WHEN NEEDED)
                // ==========================================
                // Example:
                // to: "qa1@company.com,qa2@company.com,lead@company.com",

            // ==========================================
            // 👥 CC RECIPIENTS (UNCOMMENT WHEN NEEDED)
            // ==========================================
            // Example:
            // cc: "teamlead@company.com,manager@company.com,qahead@company.com"
            )
        }

        failure {
            emailext(

                subject: "✘ BW Automation FAILED - ${currentBuild.fullDisplayName}",

                body: """
Cypress Execution FAILED

Build URL:
${env.BUILD_URL}

Check Jenkins logs and screenshots.
""",

                // 👇 PRIMARY RECEIVER (TO)
                to: 'syadav@trueigtech.com',

                // ==========================================
                // 👥 MULTIPLE TO RECIPIENTS (UNCOMMENT WHEN NEEDED)
                // ==========================================
                // to: "qa1@company.com,qa2@company.com,dev@company.com",

            // ==========================================
            // 👥 CC RECIPIENTS (UNCOMMENT WHEN NEEDED)
            // ==========================================
            // cc: "teamlead@company.com,manager@company.com"
            )
        }
    }
}
