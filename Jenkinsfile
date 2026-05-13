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
                bat 'if exist test-report.zip del /f /q test-report.zip'
                bat 'mkdir allure-results'
            }
        }

        stage('Run Cypress Tests') {

            steps {
                script {

                    currentBuild.result = 'SUCCESS'

                    try {

                        bat '''
                        npx cypress run ^
                        --spec "cypress/e2e/**/*.cy.js"
                        '''

                    } catch (err) {

                        currentBuild.result = 'FAILURE'
                        echo "Cypress failed but pipeline will continue..."
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

        stage('Create ZIP Report') {
            steps {
                bat '''
                powershell Compress-Archive -Path allure-results,cypress\\screenshots -DestinationPath test-report.zip -Force
                '''
            }
        }
    }

    post {

        always {

            archiveArtifacts artifacts: '''
                test-report.zip,
                allure-results/**,
                cypress/screenshots/**
            ''',
            fingerprint: true,
            allowEmptyArchive: true

            echo "Pipeline completed with status: ${currentBuild.result}"
        }

        success {

            emailext(
                subject: "✔ QA Daily Status — BetterWin Automation — ${new Date().format('dd-MM-yyyy')} ✅ PASS",

                body: """
Cypress Execution Completed Successfully

Status: ALL TESTS PASSED ✅

Build URL:
${env.BUILD_URL}

📦 Report Attached: ZIP File
📊 Allure Report Available in Jenkins

Best Regards,  
QA Team (Automation)
""",

                to: """
syadav@trueigtech.com,
hyadav@trueigtech.com
""",

                attachmentsPattern: '''
                    test-report.zip
                '''
            )
        }

        unstable {

            emailext(
                subject: "⚠ QA Daily Status — BetterWin Automation — ${new Date().format('dd-MM-yyyy')} ⚠ ISSUES FOUND",

                body: """
Cypress Execution Completed WITH FAILURES ⚠

Status: SOME TESTS FAILED

Build URL:
${env.BUILD_URL}

📦 Report Attached: ZIP File
📊 Check Allure + Screenshots inside ZIP

Best Regards,  
QA Team (Automation)
""",

                to: """
syadav@trueigtech.com,
hyadav@trueigtech.com
""",


                attachmentsPattern: '''
                    test-report.zip
                '''
            )
        }

        failure {

            emailext(
                subject: "✘ QA Daily Status — BetterWin Automation — ${new Date().format('dd-MM-yyyy')} ❌ FAILED",

                body: """
Cypress Execution FAILED ❌

Build URL:
${env.BUILD_URL}

Critical issue occurred during execution.

📦 ZIP report attached (if generated)

Best Regards,  
QA Team (Automation)
""",

                to: """
syadav@trueigtech.com,
hyadav@trueigtech.com
""",


                attachmentsPattern: '''
                    test-report.zip,
                    cypress/screenshots/**
                '''
            )
        }
    }
}