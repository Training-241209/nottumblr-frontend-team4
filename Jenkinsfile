pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nottumblr-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
        BACKEND_URL = 'http://18.220.70.231:8081'
    }

    stages {
        stage('Docker Build') {
          steps {
             sh "docker build --build-arg VITE_API_URL=${BACKEND_URL} -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
          }
        }
        stage('Docker Run') {
          steps {
            // Stop & remove old container if needed
              sh "docker stop ${DOCKER_IMAGE} || true"
              sh "docker rm ${DOCKER_IMAGE} || true"
              sh "docker run -d -p 81:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}"
          }
        }
    }
}