# CQRS Notes

## Steps

- Identify Features

- Identify Services
  - Search
  - Messaging
  - Analytics

- Identify Controllers
  - Run Services in their own processes
  - Their is one master process running as the api gateway.

- Identify the right transport method

## Cons

- Injecting services in controllers is not possible as they run in separate process.

## Key takeaways

- Microservices are run as separate processes

## CQRS

- Separate a RW service into two:
  - R service - Query
  - S service - Command
- Both Services have their own representation of underlying models

- Event store - Persists system event
- Command - Creates an event in event store
- Event handler - Processes the event asynchronously and updates the read data store 

- Snapshot
  - Checkpoints of the current state of the system to use as seed/base for later events
  - Point to a version
  - Valid at one point of time

### Note

- You don't need Event Sourcing to do CQRS, but the two work great together 
- Each event must be handled once and only once

## Event Store

- Table `events`
  type - aggregate_id - version - date - published

## Example

Event-driven Coffee Shop (Write-side)

Order Service                       Beans Service                         Barista Service

- void OrderCofee()
- OrderPlaced
                                  - validateBeans()
- OrderBeansValidated

- acceptOrder()
- OrderAccepted
                                                                          - makeCoffee()
                                                                          - CoffeeBrewStarted
- startOrder()
- OrderStarted
                                    - fetchBeans()
                                    - BeansFetched
                                                                          - CoffeeBrewFinished
- finishOrder()
- OrderFinished
                                                                          - Coffee Delivered
- deliverOrder()
- Order Delivered


- Controller injected with CommandService and QueryService

- OrderCommandService.placeOrder
  - eventpublisher.publish(new OrderPlaced(orderInfo))

## Analytics Service

- LinkCreated
- LinkQueried
- LinkFound
- LinkFailed

- Url methods
  - Constructor
  - getUrlId
