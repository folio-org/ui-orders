@Library ('folio_jenkins_shared_libs@folio-1818-sonar-coverage') _

buildNPM {
  publishModDescriptor = true
  runLint = true
  runSonarqube = true
  runTest = true
  runTestOptions = '--karma.singleRun --karma.browsers ChromeDocker --karma.reporters mocha junit --coverage'
}
