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
                git branch: 'main',
                url: 'https://github.com/sanidhyayadav01/BW_HF_Automation.git'
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

        // =========================================
        // CLEAN OLD REPORTS
        // =========================================
        stage('Clean Previous Reports') {
            steps {

                // Delete old allure + screenshots + videos
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'if exist allure-report rmdir /s /q allure-report'

                bat 'if exist cypress\\screenshots rmdir /s /q cypress\\screenshots'
                bat 'if exist cypress\\videos rmdir /s /q cypress\\videos'

                // Recreate folders
                bat 'mkdir allure-results'
            }
        }

        // =========================================
        // RUN SIGNUP FIRST
        // =========================================
        stage('Run Signup Setup Spec') {
            steps {

                script {

                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {

                        bat '''
                        npx cypress run ^
                        --spec "cypress/e2e/00_auth/01_LoginSignup.cy.js"
                        '''

                    }
                }
            }
        }

        // =========================================
        // RUN REMAINING TESTS
        // =========================================
        stage('Run Remaining Cypress Tests') {
            steps {

                script {

                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {

                        bat '''
                        npx cypress run ^
                        --spec "cypress/e2e/**/*.cy.js,^cypress/e2e/00_auth/01_LoginSignup.cy.js"
                        '''

                    }
                }
            }
        }

        // =========================================
        // GENERATE ALLURE
        // =========================================
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

        // =========================================
        // ALWAYS
        // =========================================
        always {

            archiveArtifacts artifacts: '''
                allure-results/**,
                allure-report/**,
                cypress/screenshots/**/*.png,
                cypress/videos/**/*.mp4
            ''',
            fingerprint: true,
            allowEmptyArchive: true

            echo 'Pipeline execution completed.'
        }

        // =========================================
        // SUCCESS MAIL
        // =========================================
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
- Videos
- Allure Report
""",

                to: 'syadav@trueigtech.com',

                attachmentsPattern: '''
                    cypress/screenshots/**/*.png,
                    cypress/videos/**/*.mp4
                '''
            )
        }

        // =========================================
        // FAILURE MAIL
        // =========================================
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
- Attached Videos
""",

                to: 'syadav@trueigtech.com',

                attachmentsPattern: '''
                    cypress/screenshots/**/*.png,
                    cypress/videos/**/*.mp4
                '''
            )
        }

        // =========================================
        // UNSTABLE MAIL
        // =========================================
        unstable {

            emailext(

                subject: "⚠ BW Automation UNSTABLE - ${currentBuild.fullDisplayName}",

                body: """
Cypress Execution Completed WITH FAILURES

Build URL:
${env.BUILD_URL}

Some test cases failed.

Check:
- Allure Report
- Screenshots
- Jenkins Logs

Allure:
${env.BUILD_URL}allure
""",

                to: 'syadav@trueigtech.com',

                attachmentsPattern: '''
                    cypress/screenshots/**/*.png,
                '''
            )
        }
    }
}