# Screencast
Link: https://youtu.be/FRmd-CnC4Ds 
# Implementation
I completed Task 1-5 as required.

# Answer to conceptual questions

## Describe three desirable properties for infrastructure.
   
- Available. The infrastructure should always enable users to use the service. There should be no or very short down time. 
- Robust. The infrastructure should be able to respond to something failing, and when that happen, still be able to provide service or minimal service.
- Isolation. The impact of one component on another is reduced. A failing component should not cause cascading failure of other components

## Describe some benefits and issues related to using Load Balancers.

### Benefits
- Better utilize resources and help availability and scalability.
- Send requests only to healthy instances.
- Automatically request new instances as needed. 
### Issues
- Add one more possible failure point: what if load balancer itself is down? - May use leader election among servers.

## What are some reasons for keeping servers in seperate availability zones?

- Create isolated production environments to help availabity and scalability.
- Stop cascading failure, ex. one issue in a production environemnt does not bring down the whole service.
- Switch requests to another zone if one is unavailable temporarily (ex. deploying a new version).
- Anticiplate large traffic boost and be prepared. Avoid slow spin up.
- If specializing zones geographically (regions), traffic can be sent to nearest location; can handle different laws and rules.

## Describe the Circuit Breaker and Bulkhead pattern.
### Circuit Breaker pattern
Maintain a object recording the status of a service in the infrastructure, so that if it is temporarily down, the unavailabitiy can be detected, and recurring errors and failures are prevented. 

Refers to:
- https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern

### Bulkhead pattern
Assign isolated connection pools (i.e. the bulkhead) to different services, so that if one service is problematic (ex. slow or down), the issue is constrained in its own "bulkhead", and does not cascadingly deplete resources for other services. Services assigined with other connection pools can still function.  

For each client, a seperated service instance is assigned (a connection in the connection pool). Hence, if something wrong with a specific client, ohter clients can still be served.

Refers to: 
- https://docs.microsoft.com/en-us/azure/architecture/patterns/bulkhead
- https://www.youtube.com/watch?v=Kh3HxWk8YF4

