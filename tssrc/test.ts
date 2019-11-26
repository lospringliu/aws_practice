import AWS from './aws_init'
import {  ec2, newEc2Instance, newEc2InstancePromise } from './ec2'
const sleep = (timeout: number = 1000) => new Promise(resolve => setTimeout(() => resolve(), timeout))

sleep(1).then(async () => {
    try {
        const data = await newEc2InstancePromise()
        console.log(data)
    } catch (error) {
        console.error(error)
    }
})