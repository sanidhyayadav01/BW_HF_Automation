pipeline {

    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CI = "true"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/sanidhyayadav01/BW_HF_Automation.git'
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
                bat 'npx cypress run'
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat 'allure generate allure-results --clean -o allure-report'
            }
        }

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

    post {

        always {
            archiveArtifacts artifacts: 'allure-report/**', fingerprint: true
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
                to: "syadav@trueigtech.com"

                // 🔹 Multiple emails (enable when needed)
                // to: "syadav@trueigtech.com,user2@gmail.com,user3@gmail.com"

                // 🔹 CC recipients (enable when needed)
                // cc: "qa.team@company.com,manager@company.com"
            )
        }

        failure {
            emailext(
                subject: "✘ BW Automation FAILED - ${currentBuild.fullDisplayName}",
                body: """
                    Cypress Execution FAILED

                    Build URL:
                    ${env.BUILD_URL}

                    Please check Jenkins logs immediately.
                """,
                to: "syadav@trueigtech.com"

                // cc: "qa.team@company.com,manager@company.com"
            )
        }
    }
}