import AWS from 'aws-sdk'

AWS.config.getCredentials(async (error) => {
    console.log("#### get credentials ####")
    console.log(AWS.config.credentials)
})

// configure agent http or https
const https = require('https')
const agent = new https.Agent({
  maxSockets: 25,
  keepAlive: true
})

AWS.config.update({
  httpOptions: {
    agent
  }
})

// configure region
AWS.config.update({region: 'us-east-1'})

// api versions
AWS.config.apiVersions = {
  ec2: '2016-11-15'
}

export default AWS
