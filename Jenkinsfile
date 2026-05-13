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
                        echo "Cypress failed but continuing pipeline..."
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
                script {
                    bat '''
                    powershell -Command "
                        $items = @()

                        if (Test-Path 'allure-results') { $items += 'allure-results' }
                        if (Test-Path 'allure-report') { $items += 'allure-report' }
                        if (Test-Path 'cypress\\screenshots') { $items += 'cypress\\screenshots' }

                        if ($items.Count -gt 0) {
                            Compress-Archive -Path $items -DestinationPath test-report.zip -Force
                            Write-Host 'ZIP created successfully'
                        } else {
                            Write-Host 'No artifacts found for ZIP'
                        }
                    "
                    '''
                }
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
📊 QA AUTOMATION REPORT (SUCCESS)

Project: BetterWin Automation
Status: ALL TESTS PASSED ✅

Build URL:
${env.BUILD_URL}

-------------------------------
✔ Tests Executed:
- Login / Signup
- Dashboard Navigation
- Casino / Live Casino
- Crash Games
- Promotions
- Favorites
- Tournaments
- Footer Links

-------------------------------
📦 Artifacts:
- test-report.zip (FULL REPORT)
- Allure Report available in Jenkins
- Screenshots included

-------------------------------
Best Regards,
QA Team (Automation)
""",

                to: '''
syadav@trueigtech.com,
hyadav@trueigtech.com
''',

                attachmentsPattern: 'test-report.zip'
            )
        }

        unstable {
            emailext(

                subject: "⚠ QA Daily Status — BetterWin Automation — ${new Date().format('dd-MM-yyyy')} ⚠ ISSUES FOUND",

                body: """
📊 QA AUTOMATION REPORT (UNSTABLE)

Project: BetterWin Automation
Status: SOME TEST FAILURES ⚠

Build URL:
${env.BUILD_URL}

-------------------------------
⚠ Some test cases failed

Check:
- Failing screenshots
- Allure report
- test-report.zip

-------------------------------
Best Regards,
QA Team (Automation)
""",

                to: '''
syadav@trueigtech.com,
hyadav@trueigtech.com
''',

                attachmentsPattern: 'test-report.zip'
            )
        }

        failure {
            emailext(

                subject: "✘ QA Daily Status — BetterWin Automation — ${new Date().format('dd-MM-yyyy')} ❌ FAILED",

                body: """
📊 QA AUTOMATION REPORT (FAILURE)

Project: BetterWin Automation
Status: PIPELINE FAILED ❌

Build URL:
${env.BUILD_URL}

-------------------------------
Critical failure occurred during execution.

Check:
- Jenkins logs
- Environment setup
- Cypress run logs

-------------------------------
Best Regards,
QA Team (Automation)
""",

                to: '''
syadav@trueigtech.com,
hyadav@trueigtech.com
''',

                attachmentsPattern: 'test-report.zip,cypress/screenshots/**'
            )
        }
    }
}