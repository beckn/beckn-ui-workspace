pipeline {
  agent { 
      label "jenkins-android-build-ubuntu"
  }
  tools {
    nodejs 'nodejs19'
  }
  stages {
    stage('Build') {
      steps {
        sh '''
        git checkout "${GIT_BRANCH}"
        rm package-lock.json
        CI=false npm install -f
        CI=false npm run build
        CI=false npm run export
        '''          
      }
    }
    stage('Deploy') {
      steps {
        sh '''
        aws s3 cp --recursive ./out/ "${S3_BUCKET}"
        aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION_ID}" --paths "/*"
        '''
      }
    }
  }
  post {
    always {
        cleanWs()
        }
    }
}
