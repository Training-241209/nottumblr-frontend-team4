pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nottumblr-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Docker Build') {
          steps {
             sh "docker build --no-cache -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
          }
        }
        stage('Docker Run') {
          steps {
            // Stop & remove old container if needed
              sh "docker stop ${DOCKER_IMAGE} || true"
              sh "docker rm ${DOCKER_IMAGE} || true"
              sh "docker run -d -p 8082:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}"
          }
        }
    }
}