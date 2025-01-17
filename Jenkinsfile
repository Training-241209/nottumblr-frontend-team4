pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'quizzer-app-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Docker Build') {
          steps {
            sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
          }
        }
        stage('Docker Run') {
          steps {
            // Stop & remove old container if needed
              sh "docker stop ${DOCKER_IMAGE} || true"
              sh "docker rm ${DOCKER_IMAGE} || true"
              sh "docker run -d -p 80:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}"
          }
        }
    }
}