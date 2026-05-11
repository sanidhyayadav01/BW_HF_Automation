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
                // IMPORTANT: allows pipeline to continue even if tests fail
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    bat 'npx cypress run'
                }
            }
        }

        stage('Generate Allure Results') {
            steps {
                // ensure folder exists even if tests fail
                bat 'if not exist allure-results mkdir allure-results'
            }
        }

        stage('Publish Allure Report') {
            steps {
                // don't fail pipeline if allure plugin has issue
                catchError {
                    allure([
                        includeProperties: false,
                        jdk: '',
                        results: [[path: 'allure-results']]
                    ])
                }
            }
        }
    }

    post {

        always {

            // Archive everything useful (VERY IMPORTANT for debugging)
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

                subject: "✔ BW Automation SUCCESS - ${currentBuild.fullDisplayName}",

                body: """
Cypress Execution Completed Successfully

Build URL:
${env.BUILD_URL}

Allure Report:
${env.BUILD_URL}allure
""",

                to: 'syadav@trueigtech.com',

                // ==============================
                // 👥 MULTIPLE TO (UNCOMMENT WHEN NEEDED)
                // ==============================
                // to: "qa1@company.com,qa2@company.com,lead@company.com",

                // ==============================
                // 👥 CC RECIPIENTS (UNCOMMENT WHEN NEEDED)
                // ==============================
                // cc: "teamlead@company.com,manager@company.com",

                attachmentsPattern: 'cypress/screenshots/**,cypress/videos/**'
            )
        }

        failure {
            emailext(

                subject: "✘ BW Automation FAILED - ${currentBuild.fullDisplayName}",

                body: """
Cypress Execution FAILED

Build URL:
${env.BUILD_URL}

Please check:
- Jenkins console logs
- Screenshots
- Videos attached in email
""",

                to: 'syadav@trueigtech.com',

                // ==============================
                // 👥 MULTIPLE TO (UNCOMMENT WHEN NEEDED)
                // ==============================
                // to: "qa1@company.com,qa2@company.com,dev@company.com",

                // ==============================
                // 👥 CC RECIPIENTS (UNCOMMENT WHEN NEEDED)
                // ==============================
                // cc: "teamlead@company.com,manager@company.com",

                attachmentsPattern: 'cypress/screenshots/**,cypress/videos/**'
            )
        }
    }
}