# Recording-Proxy
A layer between your smoke tests and an unreliable backend.

### Technical Overview
---- To be written ----

### Further Development and Testing
All classes and components of this application have corresponding unit test files under the `spec` folder. Due to the complex nature of this package, standard unit tests will not be sufficient to ensure stability, two sub-packages `mock-server` and `mock-crawler` are included under the `dev` folder. These two packages are intended to be used together to perform an automated integration test.

See the individual README's in `mock-server` and `mock-crawler` for more info regarding their unit tests and how to extend functionality.
