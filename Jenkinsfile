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

        stage('Clean Previous Reports') {
            steps {
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'if exist allure-report rmdir /s /q allure-report'
                bat 'if exist cypress\\screenshots rmdir /s /q cypress\\screenshots'
                bat 'mkdir allure-results'
            }
        }

        stage('Run Cypress Tests') {

            steps {
                script {

                    def testStatus = 'SUCCESS'

                    try {

                        bat '''
                        npx cypress run ^
                        --spec "cypress/e2e/**/*.cy.js"
                        '''

                    } catch (err) {

                        testStatus = 'FAILURE'
                        currentBuild.result = 'FAILURE'
                        throw err

                    } finally {

                        // if tests ran but had failures Cypress may mark unstable
                        if (currentBuild.result == null) {
                            currentBuild.result = testStatus
                        }

                        echo "Final Test Status: ${currentBuild.result}"
                    }
                }
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
                cypress/screenshots/**
            ''',
            fingerprint: true,
            allowEmptyArchive: true

            echo 'Pipeline execution completed.'
        }

        success {

            emailext(
                subject: "✔ QA Daily Status — BetterWin Automation — ${new Date().format('dd-MM-yyyy')} ✅ PASS",

                body: """
Cypress Execution Completed Successfully

Project: BetterWin Automation

Status: ALL TESTS PASSED ✅

Build URL:
${env.BUILD_URL}

Reports:
- Allure Report: ${env.BUILD_URL}allure

Checks Covered:
✅ Login / Signup
✅ Dashboard Navigation
✅ Casino / Live Casino
✅ Crash / Arcade Games
✅ Promotions & Banner
✅ Favorites
✅ Tournaments
✅ Footer Links


Best Regards,  
QA Team (Automation)
""",

                to: """
syadav@trueigtech.com,
hyadav@trueigtech.com
""",

                attachmentsPattern: '''
                    cypress/screenshots/**
                    allure-results/**
                '''
            )
        }

        unstable {

            emailext(
                subject: "⚠ QA Daily Status — BetterWin Automation — ${new Date().format('dd-MM-yyyy')} ⚠ ISSUES FOUND",

                body: """
Cypress Execution Completed WITH FAILURES

Project: BetterWin Automation

Status: SOME TESTS FAILED ⚠

Build URL:
${env.BUILD_URL}

Please check:
- Failing screenshots
- Allure report
- Jenkins console logs


Best Regards,  
QA Team (Automation)
""",

                to: """
syadav@trueigtech.com,
hyadav@trueigtech.com
""",

                attachmentsPattern: '''
                    cypress/screenshots/**
                    allure-results/**
                '''
            )
        }

        failure {

            emailext(
                subject: "✘ QA Daily Status — BetterWin Automation — ${new Date().format('dd-MM-yyyy')} ❌ FAILED",

                body: """
Cypress Execution FAILED

Project: BetterWin Automation

Status: PIPELINE FAILED ❌

Build URL:
${env.BUILD_URL}

Critical failure occurred in execution.

Check:
- Jenkins logs
- Environment issues
- Build setup


Best Regards,  
QA Team (Automation)
""",

                to: """
syadav@trueigtech.com,
hyadav@trueigtech.com
""",

                attachmentsPattern: '''
                    cypress/screenshots/**
                '''
            )
        }
    }
}