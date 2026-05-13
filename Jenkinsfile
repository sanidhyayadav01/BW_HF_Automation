pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CI = 'true'
    }

    stages {
        // =========================================
        // CLONE REPOSITORY
        // =========================================
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/sanidhyayadav01/BW_HF_Automation.git'
            }
        }

        // =========================================
        // INSTALL DEPENDENCIES
        // =========================================
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        // =========================================
        // VERIFY CYPRESS
        // =========================================
        stage('Verify Cypress') {
            steps {
                bat 'npx cypress verify'
            }
        }

        // =========================================
        // CLEAN OLD REPORTS
        // =========================================
        stage('Clean Previous Reports') {
            steps {
                bat 'if exist allure-results rmdir /s /q allure-results'

                bat 'if exist allure-report rmdir /s /q allure-report'

                bat 'if exist cypress\\screenshots rmdir /s /q cypress\\screenshots'

                bat 'mkdir allure-results'
            }
        }

        // =========================================
        // RUN CYPRESS TESTS
        // =========================================
        stage('Run Cypress Tests') {
            steps {
                script {
                    try {
                        bat '''
    npx cypress run ^
    --spec "cypress/e2e/00_auth/01_LoginSignup.cy.js,cypress/e2e/**/*.cy.js"
    '''
                    }
                    finally {
                        echo 'Cypress execution completed.'
                    }
                }
            }
        }

        // =========================================
        // GENERATE ALLURE REPORT
        // =========================================
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

    // =========================================
    // POST ACTIONS
    // =========================================
    post {
        // =====================================
        // ALWAYS
        // =====================================
        always {
            archiveArtifacts artifacts: '''
                allure-results/**,
                allure-report/**,
                cypress/screenshots/**/*.png
            ''',
            fingerprint: true,
            allowEmptyArchive: true

            echo 'Pipeline execution completed.'
        }

        // =====================================
        // SUCCESS MAIL
        // =====================================
        success {
            emailext(

                subject: "✔ BW Automation SUCCESS - ${currentBuild.fullDisplayName}",

                body: """
Cypress Execution Completed Successfully

Build URL:
${env.BUILD_URL}

Allure Report:
${env.BUILD_URL}allure

Artifacts:
- Screenshots
- Allure Report
""",

                // MAIN RECIPIENTS
                to: '''
                    syadav@trueigtech.com,
                    hyadav@trueigtech.com,
                ''',

                // CC RECIPIENTS
                // cc: '''
                //     teamlead@company.com,
                //     devlead@company.com
                // ''',

                attachmentsPattern: '''
                    cypress/screenshots/**/*.png
                '''
            )
        }

        // =====================================
        // FAILURE MAIL
        // =====================================
        failure {
            emailext(

                subject: "✘ BW Automation FAILED - ${currentBuild.fullDisplayName}",

                body: """
Cypress Execution FAILED

Build URL:
${env.BUILD_URL}

Check:
- Jenkins Console Logs
- Allure Report
- Attached Screenshots

Allure:
${env.BUILD_URL}allure
""",

                // MAIN RECIPIENTS
                to: '''
                    syadav@trueigtech.com,
                    hyadav@trueigtech.com,
                ''',

                // CC RECIPIENTS
                // cc: '''
                //     teamlead@company.com,
                //     devlead@company.com
                // ''',

                attachmentsPattern: '''
                    cypress/screenshots/**/*.png
                '''
            )
        }
    }
}
