# Load Testing

## Prerequisites
Installing artillery with npm. Run the following command
```
npm install -g artillery@latest
```

Run the server from the .\back_end directory with:
```
npm run dev
```

## How to run

In the .\back_end\test\load_test\ directory run the following scripts:

To execute the load test.
```
artillery run load_test.yml
```

To output a json format with the data:
```
artillery run load_test.yml --output load_test.json
```

To generate an HTML report. 
```
artillery report load_test.json
```
