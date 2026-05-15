pipeline {

    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CI = 'true'
        CYPRESS_screenshotOnRunFailure = 'true'
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
--spec "cypress/e2e/**/*.cy.js" ^
--config video=false,screenshotOnRunFailure=true
'''

                    }
                    catch(err){

                        echo 'Some tests failed, continuing execution...'

                        bat '''
if exist cypress\\screenshots (
echo ====================================
echo FAILED SCREENSHOTS GENERATED:
echo ====================================
dir /s /b cypress\\screenshots
)
'''

                        currentBuild.result='UNSTABLE'
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
cypress/screenshots/**/*.png
''',
            fingerprint: true,
            allowEmptyArchive: true

            echo "Pipeline completed with status: ${currentBuild.result}"

            bat '''
if exist cypress\\screenshots (
echo ====================================
echo ARCHIVED SCREENSHOTS:
echo ====================================
dir /s /b cypress\\screenshots
)
'''
        }

        success {

            emailext(

subject: "Daily QA Check — BetterWin Automation Report — ${new Date().format('dd-MM-yyyy HH:mm')} ✅ PASS",

body: """

Daily automated happy flow validation completed successfully.

Application:
BetterWin

Execution Status:
PASS ✅

==================================================

TEST COVERAGE SUMMARY :

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


Execution completed successfully with no critical failures detected.

Best Regards,
QA Team (Automation)

""",

to: '''
rohan@trueigtech.com,
pravesh@trueigtech.com,
aashima@trueigtech.com,
hyadav@trueigtech.com,
sgupta@trueigtech.com,
syadav@trueigtech.com
'''
            )
        }

        unstable {

            emailext(

subject: "Daily QA Check — BetterWin Automation Report — ${new Date().format('dd-MM-yyyy HH:mm')} ⚠️ ISSUES FOUND",

body: """

Daily automated validation execution completed.

Application:
BetterWin

Execution Status:
PARTIAL SUCCESS / ISSUES DETECTED ⚠️

==================================================

TEST EXECUTION SUMMARY

Completed validations:

✓ Authentication flows
✓ Navigation validation
✓ Casino module checks
✓ User experience checks
✓ API validations


FAILED VALIDATIONS

One or more scenarios failed during execution.

Attached screenshots contain exact failed pages.

Screenshot names contain:

• Spec filename (.cy.js)

• Failed test case name

• Failure indication


ACTION REQUIRED

1. Open attached screenshots

2. Identify failed spec file

3. Review Allure details

4. Investigate application issue


Best Regards,
QA Team (Automation)

""",

to: '''
rohan@trueigtech.com,
pravesh@trueigtech.com,
aashima@trueigtech.com,
hyadav@trueigtech.com,
sgupta@trueigtech.com,
syadav@trueigtech.com
''',

attachmentsPattern: '''
cypress/screenshots/**/*.png
'''
            )
        }

        failure {

            emailext(

subject: "Daily QA Check — BetterWin Automation Report — ${new Date().format('dd-MM-yyyy HH:mm')} ❌ FAILED",

body: """

Automation execution failed.

Application:
BetterWin

Execution Status:
FAILED ❌

==================================================

PIPELINE FAILURE DETAILS

Automation execution could not complete.

Possible reasons:

• Environment issue
• Infrastructure issue
• Dependency issue
• Configuration issue
• Application unavailable
• Test execution crash


ACTION REQUIRED

• Review Jenkins logs
• Verify environment
• Review attached screenshots
• Verify application accessibility


Best Regards,
QA Team (Automation)

""",

to: '''
rohan@trueigtech.com,
pravesh@trueigtech.com,
aashima@trueigtech.com,
hyadav@trueigtech.com,
sgupta@trueigtech.com,
syadav@trueigtech.com
''',

attachmentsPattern: '''
cypress/screenshots/**/*.png
'''
            )
        }
    }
}