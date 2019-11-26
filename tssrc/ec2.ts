import AWS from './aws_init'
const sleep = (timeout: number = 1000) => new Promise(resolve => setTimeout(() => resolve(), timeout))

const ec2 = new AWS.EC2()
const instanceParams = (AMI_ID: string) => ({
    ImageId: AMI_ID, 
    InstanceType: 't2.micro',
    KeyName: 'KeyNameXcliu',
    MinCount: 1,
    MaxCount: 1,
    SubnetId: 'subnet-071d6e6ad32794c2b'
 })
// ec2.createVpc
const newEc2Instance = (AMI_ID = 'ami-04b9e92b5572fa0d1') => ec2.runInstances(instanceParams(AMI_ID))
const newEc2InstancePromise = (AMI_ID = 'ami-04b9e92b5572fa0d1') => newEc2Instance(AMI_ID).promise()

export { ec2, newEc2Instance, newEc2InstancePromise }

export async function createVpc(dryRun = true, cidrBlock = '10.10.10.0/24', instanceTenancy = 'default') {
    const params = {
        CidrBlock: cidrBlock,
        DryRun: dryRun,
        InstanceTenancy: instanceTenancy
    }
    try {
        let data = await ec2.createVpc(params).promise()
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}
export function printStatuses() {
    ec2.describeInstances({}, function(err, data: any) {
        if(err) {
            console.error(err.toString())
        } else {
            var currentTime = new Date();
            console.log(currentTime.toString())

            for(const reservation of data.Reservations) {
                for(const instance of reservation.Instances) {
                    let name = ''
                    for(const tag of instance.Tags) {
                        if(tag.Key === 'Name') {
                            name = tag.Value
                        }
                    }
                    console.log('\t'+name+'\t'+instance.InstanceId+'\t'+instance.PublicIpAddress+'\t'+instance.InstanceType+'\t'+instance.ImageId+'\t'+instance.State.Name)
                }
            }
        }
    });    
}

export function createInstance(imageId:string, count=1, keyPair:string, securityGroup:string, instanceType:string) {
    ec2.runInstances({
        ImageId: imageId,
        MinCount: count,
        MaxCount: count,
        KeyName: keyPair,
        SecurityGroups: [securityGroup],
        InstanceType: instanceType
    }, function(err, data:any) {
        if(err) {
            console.error(err.toString())
        } else {
            for(const instance of data.Instances) {
                console.log('NEW:\t' + instance.InstanceId)
            }
        }
    })
}

export function terminateInstance(instanceId: string) {
    ec2.terminateInstances({ InstanceIds: [instanceId] }, function(err, data) {
        if (err) {
            console.error(err.toString())
        } else if(data.TerminatingInstances) {
           for(const instance of data.TerminatingInstances) {
                console.log('TERM:\t' + instance.InstanceId)
            } 
        } else {}
    })
}
