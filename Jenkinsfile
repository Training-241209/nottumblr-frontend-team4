pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nottumblr-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker images | grep ${DOCKER_IMAGE}"  // Optional debug step
            }
        }
        stage('Docker Run') {
            steps {
                // Stop and remove old container
                sh "docker stop ${DOCKER_IMAGE} || true"
                sh "docker rm ${DOCKER_IMAGE} || true"
                sh "docker system prune -f || true"
                // Run new container
                sh "docker run -d -p 80:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
    }
}
