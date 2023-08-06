// This can be a client or another server calling grpc server
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
const PROTO_PATH = './geoLocation.proto';
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDef = loadSync(PROTO_PATH, options);
const grpcObj = loadPackageDefinition(packageDef);
const locationPackage = grpcObj.geoLocationPackage;

const client = new locationPackage.GeoLocationService(
  'localhost:5001',
  credentials.createInsecure()
);

// These can be now used anywhere in the client side
// Function calls
client.createUser(
  {
    name: 'Arkaraj Ghosh',
    location: {
      latitude: 34.3,
      longitude: 34.3,
    },
  },
  (err, response) => {
    if (err) return 'Some error occured: ' + err;
    console.log('New User: ', response);
    return response;
  }
);

client.getUsersCurrentLocation({ id: 1 }, (err, resp) => {
  console.log("User's location: ", resp);
  return resp;
});

client.updateUserCurrentLocation(
  { id: 3, latitude: 5.5, longitude: 10.2 },
  (err, resp) => {
    console.log('Update User Location: ', resp);
    return resp;
  }
);

client.getAllUsersLocation({ query: 'Ark', limit: 2 }, (err, resp) => {
  console.log("User's: ", resp.users);
  return resp;
});
