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

                    currentBuild.result = 'SUCCESS'

                    try {

                        bat '''
npx cypress run ^
--spec "cypress/e2e/**/*.cy.js"
'''

                    }
                    catch(err){

                        echo 'Some tests failed, continuing execution...'

                        currentBuild.result = 'UNSTABLE'
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
allure-report/**,
cypress/screenshots/**
''',
            fingerprint: true,
            allowEmptyArchive: true

            echo "Pipeline completed with status: ${currentBuild.result}"
        }

        success {

            emailext(

subject: "QA Daily Status — BetterWin Automation Report — ${new Date().format('dd-MM-yyyy HH:mm')} ✅ PASS",

body: """

Daily automated happy flow validation completed successfully.

Application:
BetterWin

Execution Status:
PASS ✅

==================================================

TEST COVERAGE SUMMARY

Account Validation

✅ User registration flow validation

✅ Login flow validation

✅ Session establishment verification

✅ Authentication continuity checks


Navigation & User Journey

✅ Dashboard accessibility

✅ Menu navigation validation

✅ Page redirection checks

✅ Route verification


Casino Modules

✅ Casino page loading

✅ Live casino accessibility

✅ Crash games accessibility

✅ Promotions validation

✅ Tournaments section validation


User Experience Validation

✅ Banner rendering verification

✅ Favorites functionality

✅ Refer a Friend flow

✅ VIP Program accessibility

✅ Responsible Gaming section

✅ FAQ validation

✅ Support section validation

✅ Footer validation

✅ User profile accessibility


Data/API Validation

✅ API verification through intercepts

✅ Backend response monitoring

✅ UI + API consistency validation


AREAS NOT EXECUTED IN CURRENT AUTOMATION SCOPE

❌ Deposit testing

❌ Redeem/withdrawal testing

❌ Wallet transaction validation

❌ Gameplay execution

❌ Financial transaction testing

❌ Payment gateway validation

❌ Third-party provider integrations

❌ Stress/performance testing


Execution completed successfully with no critical failures detected.

Best Regards,
QA Team (Automation)

""",

to: '''
rohan@trueigtech.com,
pravesh@trueigtech.com,
aashima@trueigtech.com,
hyadav@trueigtech.com,
syadav@trueigtech.com
'''
            )
        }

        unstable {

            emailext(

subject: "QA Daily Status — BetterWin Automation Report — ${new Date().format('dd-MM-yyyy HH:mm')} ⚠️ ISSUES FOUND",

body: """

Daily automated validation execution completed.

Application:
BetterWin

Execution Status:
PARTIAL SUCCESS / ISSUES DETECTED ⚠️

==================================================

TESTS EXECUTED

Account Validation

✓ Registration checks

✓ Login checks

✓ Session validation


Navigation

✓ Dashboard verification

✓ Routing validation

✓ Navigation validation


Casino Modules

✓ Casino validation

✓ Live casino validation

✓ Crash games validation

✓ Promotions validation


User Experience

✓ Banner checks

✓ Favorites

✓ Refer a Friend

✓ VIP Program

✓ FAQ

✓ Support

✓ Footer

✓ User Profile


API Validation

✓ Intercepts executed

✓ Backend monitoring


ISSUES IDENTIFIED

⚠ One or more automation validations failed

⚠ Review failed scenarios

⚠ Verify screenshots

⚠ Review Allure execution details


AREAS NOT INCLUDED

❌ Deposit testing

❌ Redeem testing

❌ Wallet transactions

❌ Gameplay execution

❌ Payment validations


Execution completed with non-blocking issues.

Best Regards,
QA Team (Automation)

""",

to: '''
rohan@trueigtech.com,
pravesh@trueigtech.com,
aashima@trueigtech.com,
hyadav@trueigtech.com,
syadav@trueigtech.com
'''
            )
        }

        failure {

            emailext(

subject: "QA Daily Status — BetterWin Automation Report — ${new Date().format('dd-MM-yyyy HH:mm')} ❌ FAILED",

body: """

Automation execution failed.

Application:
BetterWin

Execution Status:
FAILED ❌

==================================================

PIPELINE FAILURE DETAILS

Automation execution did not complete successfully.

Possible reasons:

• Environment issue

• Infrastructure issue

• Dependency installation issue

• Application unavailable

• Test execution crash

• Configuration issue


VALIDATION STATUS

Automation flow interrupted before completion.

Results may be incomplete.


RECOMMENDED ACTIONS

• Review Jenkins logs

• Verify environment availability

• Verify dependency installation

• Verify application accessibility

• Review screenshots and execution logs


AREAS NOT EXECUTED

❌ Registration

❌ Login

❌ Casino validations

❌ API validations

❌ User flow validations


Best Regards,
QA Team (Automation)

""",

to: '''
rohan@trueigtech.com,
pravesh@trueigtech.com,
aashima@trueigtech.com,
hyadav@trueigtech.com,
syadav@trueigtech.com
'''
            )
        }
    }
}