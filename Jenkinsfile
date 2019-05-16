pipeline {
    agent {
        docker {
            image 'tssword/node_yarn_pm2'
            args '-p 4000:4000'
        }
    }

    environment {
        CI='true'
    }

    stages {
        stage('build') {
            steps {
                sh 'yarn'
                sh 'npm run build-ts'
            }
        }
        stage('test') {
            steps {
                echo 'Testing'
            }
        }
        stage('deploy') {
            steps {
                echo 'Deploying'
                sh 'node dist/app.js'
                // sh 'pm2 start dist/app.js -n business_server'
            }
        }
    }
    post {
    always {
        echo 'One way or another, I have finished'
        // deleteDir() /* clean up our workspace */
    }
    success {
        echo 'I succeeeded!'
    }
    unstable {
        echo 'I am unstable :/'
    }
    failure {
        echo 'I failed :('
    }
    changed {
        echo 'Things were different before...'
    }
}
}
