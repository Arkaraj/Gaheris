import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './geoLocation.proto';

const loaderOptions = {
  // keepCase - protoLoader to maintain protobuf field names.
  keepCase: true,
  // longs and enums store the data types that represent long and enum values.
  longs: String,
  enums: String,
  // defaults, when set to true, sets default values for output objects.
  defaults: true,
  oneofs: true, // https://protobuf.dev/programming-guides/proto3/#oneof
};

const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);

const grpcObj = grpc.loadPackageDefinition(packageDef);
const locationPackage = grpcObj.geoLocationPackage;

import UserEntity from './entities/Users.js';
const userRepo = new UserEntity();

const HOST = '127.0.0.1',
  PORT = 5001;
const server = new grpc.Server();

// functions
server.addService(locationPackage.GeoLocationService.service, {
  createUser: async (call, callback) => {
    try {
      const { name, location } = call.request;

      const user = await userRepo.createNewUser({ name, location });

      // callback's first param is byte length
      callback(null, user);
    } catch (error) {
      console.log(`Function Error: ` + error);
      callback(null, null);
    }
  },
  getAllUsersLocation: async (call, callback) => {
    const users = await userRepo.getAllUsers(call.request);
    callback(null, { users });
  },
  getUsersCurrentLocation: async (call, callback) => {
    const location = await userRepo.getUsersLocation(call.request.id);
    callback(null, location);
  },
  updateUserCurrentLocation: async (call, callback) => {
    const { id, latitude, longitude } = call.request;
    const user = await userRepo.updateUsersLocation(id, latitude, longitude);
    if (!user) callback(null, null);
    else callback(null, user);
  },
});

server.bindAsync(
  `${HOST}:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port = PORT) => {
    if (!error) {
      console.log(`Server running at http://${HOST}:${port} 🚀`);
      server.start();
    } else {
      console.log('Error Occured while running the grpc server: ', error);
    }
  }
);
