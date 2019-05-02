pipeline {
    agent {
        docker {
            image 'node:8.12.0'
            args '-p 4000:4000'
        }
    }

    environment {
        CI='true'
    }

    stages {
        stage('build') {
            steps {
                sh 'npm install'
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
