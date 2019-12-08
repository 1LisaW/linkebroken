def projectName = scm.getUserRemoteConfigs()[0].getUrl().tokenize('/').last().split("\\.")[0]
def label = "rdbuild-${UUID.randomUUID().toString()}"

podTemplate(cloud: 'openshift', label: label, serviceAccount: 'jenkins-jnlp', containers: [
  containerTemplate(name: 'docker', image: 'docker-registry.default.svc:5000/site/docker-hadolint:latest_develop',
      alwaysPullImage: true, privileged: true, ttyEnabled: true, command: 'cat'),
  containerTemplate(name: 'nodejs', image: 'node:10', ttyEnabled: true, command: 'cat'),
  containerTemplate(name: 'deploy', image: 'docker-registry.default.svc:5000/site/openshift-helm:latest_develop',
      alwaysPullImage: true, privileged: true, ttyEnabled: true, command: 'cat')],
  volumes: [
    secretVolume(mountPath: '/etc/docker/certs.d/docker-registry-default.utm.sigma.sbrf.ru', secretName: 'registry-certificates', readonly: true),
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
  ]
){
  node(label) {

    stage ('Clone repository') {
	    checkout scm
    }

    stage ('Lint Dockerfiles') {
        container('docker') {
        echo "Linting nodejs Dockerfile"
        sh "hadolint Dockerfile"
      }
    }

    def normalizedBranchName = env.BRANCH_NAME == "master" ? "" : "_" + env.BRANCH_NAME.replace('/', '.').replace(',', '.')
    def imageTagVersion = "${env.BUILD_NUMBER}${normalizedBranchName}"
    def imageTagLatest = "latest${normalizedBranchName}"

    stage('Build docker image') {

      container('docker') {
        docker.withRegistry("https://${env.DOCKER_REGISTRY_DEV_HOST}", "sa") {
          def imageName = "${env.DOCKER_REGISTRY_DEV_HOST}/site/${projectName}:${imageTagVersion}"
          image = docker.build(imageName, "-f Dockerfile \
                --build-arg http_proxy=${env.DOCKER_PROXY} --build-arg https_proxy=${env.DOCKER_PROXY} \
                --pull .")
          image.push(imageTagVersion)
          image.push(imageTagLatest)
        }
      }

    }

    stage('Deploy') {
      def releaseName = env.BRANCH_NAME == "master" ? "prod" : "test"
      container('deploy') {
        sh """
          oc project ${projectName}
          helm template Charts/${projectName} \
              --set image.version=${imageTagVersion} \
              -f Charts/${projectName}/env/${releaseName}.yaml \
            | oc apply -f - --validate
          oc rollout latest dc/${projectName}-${releaseName}
          oc rollout status dc/${projectName}-${releaseName}
        """
      }
    }

  }

}
