pipeline {
  agent any
  stages {
    stage('Executing Shell Script On Server') {
      steps {
        script {
          sshagent(credentials: ['"${credentials}"']) {
            sh '''
              ssh -t -t ${userName}@${hostIP} -o StrictHostKeyChecking=no << EOF
              ${listOfCommands}
              logout
              EOF
              '''
          }
        }
      }
    }
  }
  post {
    always {
        cleanWs(cleanWhenNotBuilt: false,
            deleteDirs: true,
            disableDeferredWipeout: true,
            notFailBuild: true,
            patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
            [pattern: '.propsfile', type: 'EXCLUDE']])
        }
    }
}
