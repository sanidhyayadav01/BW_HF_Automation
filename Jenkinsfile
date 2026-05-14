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
                bat 'if exist zip-content rmdir /s /q zip-content'

                bat 'mkdir allure-results'
            }
        }

        stage('Run Cypress Tests') {

            steps {

                script {

                    currentBuild.result='SUCCESS'

                    try {

                        bat '''
                        npx cypress run ^
                        --spec "cypress/e2e/**/*.cy.js"
                        '''

                    }
                    catch(err){

                        echo "Some tests failed, continuing..."

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


        stage('Create ZIP Report') {

            steps {

                script {

                    catchError(buildResult: 'SUCCESS') {

                        bat '''

                        mkdir zip-content

                        if exist allure-report (
                            xcopy /E /I /Y allure-report zip-content\\allure-report
                        )

                        if exist cypress\\screenshots (
                            xcopy /E /I /Y cypress\\screenshots zip-content\\screenshots
                        )

                        powershell Compress-Archive ^
                        -Path zip-content\\* ^
                        -DestinationPath test-report.zip ^
                        -Force

                        echo ZIP created successfully

                        '''

                    }

                }

            }

        }

    }


    post {

        always {

            archiveArtifacts artifacts: '''
                test-report.zip,
                allure-report/**,
                cypress/screenshots/**
            ''',
            fingerprint: true,
            allowEmptyArchive: true

            echo "Pipeline completed with status: ${currentBuild.result}"
        }


        success {

            emailext(

                subject: "QA Daily Status — BetterWin (Automation Testing Report) — ${new Date().format('dd-MM-yyyy')} ✅ PASS",

                body: """

Daily QA happy flow testing completed for:

• BetterWin — ✅ PASS


Checks Covered:

✅ Registration (new user generated)

✅ Login

✅ Dashboard Navigation

✅ Casino

✅ Live Casino

✅ Crash Games

✅ Promotions

✅ Banner validation

✅ Favorites

✅ Refer a Friend

✅ VIP Program

✅ Tournaments

✅ My Gameplay

✅ Support

✅ FAQ

✅ Responsible Gaming

✅ Footer validation

✅ User Profile

✅ API status verification using intercepts


Not Included:

• Wallet Transactions

• Deposit testing

• Redeem testing

• Gameplay execution


Build URL:

${env.BUILD_URL}


Attached:

📦 test-report.zip

Contains:

• Allure report

• Screenshots (if generated)


Best Regards,

QA Team (Automation)

""",

                to: '''
syadav@trueigtech.com,
hyadav@trueigtech.com
''',

                //cc: '''
                //lead@company.com,
                //manager@company.com
                //''',

                attachmentsPattern: 'test-report.zip'
            )
        }



        unstable {

            emailext(

                subject: "QA Daily Status — BetterWin (Automation Testing Report) — ${new Date().format('dd-MM-yyyy')} ⚠️ Issues Found",

                body: """

Daily QA automation execution completed.

BetterWin — ⚠️ Minor Issues Found


Checks Covered:

Registration

Login

Dashboard Navigation

Casino

Live Casino

Crash Games

Promotions

Favorites

Footer

User Profile

API verification


Issues Identified:

• Some validations failed

• Please review screenshots

• See Allure report


Build URL:

${env.BUILD_URL}


Attached:

📦 test-report.zip


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

                subject: "QA Daily Status — BetterWin (Automation Testing Report) — ${new Date().format('dd-MM-yyyy')} ❌ Pipeline Failed",

                body: """

Automation execution failed.

Reason:

Pipeline / Environment issue occurred.


Check:

• Jenkins logs

• Build setup

• Environment

• Attached screenshots


Build URL:

${env.BUILD_URL}


Best Regards,

QA Team (Automation)

""",

                to: '''
syadav@trueigtech.com,
hyadav@trueigtech.com
''',

                attachmentsPattern: '''
                    test-report.zip,
                    cypress/screenshots/**
                '''
            )
        }

    }

}