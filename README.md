# orderclap

Order Clap front end

## Conventions

- Remember that all thunks wrapped inside action creators that load data from APIs, should be suffixed with \_SUCCESS. This is because we are counting API calls using this condition --> check apiStatusReducer.js
- This code base uses the conventions put forth in the Building Applications with React and Redux Pluralsight course by Cory House. create-react-app has not been used.
