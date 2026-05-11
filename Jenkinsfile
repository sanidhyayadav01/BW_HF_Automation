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
                script {
                    // ✅ Continue pipeline even if tests fail
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        bat 'npx cypress run'
                    }
                }
            }
        }

        stage('Generate Allure Results') {
            steps {
                bat 'if not exist allure-results mkdir allure-results'
            }
        }

        stage('Publish Allure Report') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE') {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            results: [[path: 'allure-results']]
                        ])
                    }
                }
            }
        }
    }

    post {

        always {

            archiveArtifacts artifacts: '''
                allure-results/**,
                allure-report/**,
                cypress/screenshots/**,
                cypress/videos/**
            ''', fingerprint: true, allowEmptyArchive: true

            echo 'Pipeline execution completed.'
        }

        success {
            emailext(

                subject: "✔ BW Automation SUCCESS - ${currentBuild.fullDisplayName}",

                body: """
Cypress Execution Completed Successfully

Build URL:
${env.BUILD_URL}

📊 Allure Report:
${env.BUILD_URL}allure

📁 Screenshots/Videos are attached below.
""",

                to: 'syadav@trueigtech.com',

                // 👇 MULTIPLE TO (UNCOMMENT IF NEEDED)
                // to: "qa1@company.com,qa2@company.com,lead@company.com",

                // 👇 CC RECIPIENTS (UNCOMMENT IF NEEDED)
                // cc: "teamlead@company.com,manager@company.com",

                attachmentsPattern: 'cypress/screenshots/**/*.png,cypress/videos/**/*.mp4'
            )
        }

        failure {
            emailext(

                subject: "✘ BW Automation FAILED - ${currentBuild.fullDisplayName}",

                body: """
Cypress Execution FAILED

Build URL:
${env.BUILD_URL}

Check:
- Jenkins Console Logs
- Screenshots (attached)
- Videos (attached)
- Allure Results
""",

                to: 'syadav@trueigtech.com',

                // 👇 MULTIPLE TO (UNCOMMENT IF NEEDED)
                // to: "qa1@company.com,qa2@company.com,dev@company.com",

                // 👇 CC RECIPIENTS (UNCOMMENT IF NEEDED)
                // cc: "teamlead@company.com,manager@company.com",

                attachmentsPattern: 'cypress/screenshots/**/*.png,cypress/videos/**/*.mp4'
            )
        }

        // 🔥 IMPORTANT FIX: handles Cypress failures properly
        unstable {
            emailext(

                subject: "⚠ BW Automation UNSTABLE - ${currentBuild.fullDisplayName}",

                body: """
Cypress Execution COMPLETED WITH FAILURES

Build URL:
${env.BUILD_URL}

Some test cases failed, but pipeline completed successfully.

Check:
- Allure Report
- Screenshots
- Videos
""",

                to: 'syadav@trueigtech.com',

                // 👇 MULTIPLE TO (UNCOMMENT IF NEEDED)
                // to: "qa1@company.com,qa2@company.com,lead@company.com",

                // 👇 CC RECIPIENTS (UNCOMMENT IF NEEDED)
                // cc: "teamlead@company.com,manager@company.com",

                attachmentsPattern: 'cypress/screenshots/**/*.png,cypress/videos/**/*.mp4'
            )
        }
    }
}