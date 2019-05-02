pipeline {
    agent {
        docker {
            image 'kkarczmarczyk/node-yarn'
            args '-p 4000:4000'
        }
    }

    environment {
        CI='true'
    }

    stages {
        stage('build') {
            steps {
                sh './jenkins/build.sh'
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
                sh './jenkins/deploy.sh'
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
