# URL Shortener

## Goal

- Create a NestJS Application which serves as a short url service.

  - It is expected that service should be able to handle other request types other than GET (POST, PUT, DELETE)
    and will let http clients to resubmit unchangeable requests (same body) to original url.

  - It is expected that:
    [x] Service should be configurable through environment variables
    [x] Application should utilise design patterns: DAO, DTO
    [x] Application should be covered by unit/integration tests
    [x] Application should consists of several microservices & api gateway as entry point
    [x] Authorization header is optional to endpoint Create Shortened Url , if omitted then use preconfigured
        domain (it should be configurable by using environment variables)
    [x] Application should let third-parties to register white-lable domains and generate white-lable secret that
        will be used to authenticate Create Shortened Url requests
    [x] Store user-agent, http headers, time, ip, referrer of short link visitor for analytical purposes and any
        other data you identify as required.
    [x] urlHash must be generated based on sequence number and represented as letters. It means You've to keep the
        current sequence number and increase it in storage for every white-label domain.

  - Would be a plus:
    [ ] Usage of CQRS
    [ ] Usage of Event-sourcing
