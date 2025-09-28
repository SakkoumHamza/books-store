def imageName = 'sakkoumhamza/books-store'
def registry = 'https://index.docker.io/v1/'

node('workers'){ 
    stage('Checkout'){ // Pulls the latest changes from the source code repository
        checkout scm
    }

    def imageTest= docker.build("${imageName}-test", "-f Dockerfile.test .")

    stage('Tests'){
        parallel(
            'Quality Tests': {
                sh "docker run --rm ${imageName}-test npm run lint" // Fix code-quality violations and reduce technical debt using eslint
            },
            'Integration Tests': {
                sh "docker run --rm ${imageName}-test npm run test"
            },
            'Coverage Reports': {
                sh "docker run --rm -v $PWD/coverage:/app/coverage ${imageName}-test npm run coverage-html"
                publishHTML (target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: "$PWD/coverage",
                    reportFiles: "index.html",
                    reportName: "Coverage Report"
                ])
            }
        )
    }

    stage('Build'){
        docker.build("${imageName}:${commitID()}")
    }

    stage('Push'){
        withCredentials([usernamePassword(credentialsId: 'registry', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh "docker login -u $DOCKER_USER -p $DOCKER_PASS $registry"
            docker.image("${imageName}:${commitID()}").push()
            if (env.BRANCH_NAME == 'develop') {
                docker.image("${imageName}:${commitID()}").push('develop')
            }
        }
    }
}

def commitID() {
    sh 'git rev-parse HEAD > .git/commitID'
    def commitID = readFile('.git/commitID').trim()
    sh 'rm .git/commitID'
    commitID
}
