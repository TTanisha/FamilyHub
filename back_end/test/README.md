# Testing

### Unit and Integration 

Inside the **`./back_end/`** directory:
```
npm test [for all tests]

npm test -- unit/models [for just unit tests]
npm test -- integration [for just integration tests]
npm test -- {user.test.js | event.test.js | familyGroup.test.js} [for a specific core feature]

npm run testFull [to get detailed code coverage information and test descriptions]
```

### Acceptance Tests

All acceptance tests are done manually. 

See [this](acceptance_tests.md) document for detailed instructions. 

### Load Tests

See [this](load_test) directory for our load tests. 
