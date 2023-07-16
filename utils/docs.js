const swaggerJsdoc = require('swagger-jsdoc');

currently_in_object = {
  "_id": "619b8ed58ef34fb3b0e53111",
  "organization_name_khmer": "",
  "plate_number": "1E761",
  "organization_name": "",
  "location": "White Shop",
  "type": "unknown",
  "time": "2021-11-22T19:35:14.372Z",
  "approved": false,
  "vehicle_type": "motorbike",
  "__v": 0
}

plate_log_object = {
  "_id": "602384d819bbcaddb04920af",
  "organization_name_khmer": "ភ្នំពេញ",
  "plate_number": "2AF9291",
  "organization_name": "BANTEAY MEANCHEY",
  "location": "Ou Tasek",
  "type": "unknown",
  "time": "2021-02-10T14:01:44.000Z",
  "status": "In",
  "__v": 0,
  "approved": false,
}

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'LPRS-Backend',
      version: '1.0.0',
      description: 'Routes for plate management',
    },
    servers: [
      { url: 'http://localhost:3000/api' },    // change from port 3000 to 3001
      { url: 'http://192.168.0.56:3000/api' },
    ],
    openapi: "3.0.0",
    components: {
      schemas: {
        approve: {
          type: "object",
          example: {
            change: true,
            plate_number: "1D2123",
            organization_name: "PHNOM PENH",
            organization_name_khmer: "ភ្នំពេញ",
            status: "In",
            origin: "PHNOM PENH",
            nationality: "Khmer",
            reason: "stay",
            temperature: "36.2",
            vehicle_type: "motorbike",
            status: "In",
            phone_number: "098235234",
            num_people: "1",
            approved_by: "Daly",
            plate: plate_log_object
          }
        },
        plate_log: {
          type: "object",
          description: "The plate object of plate_logs",
          example: plate_log_object
        },
        currently_in: {
          type: "object",
          description: "The plate object of currently_in",
          example: currently_in_object
        },
        currently_ins: {
          type: "array",
          example: [currently_in_object]
        },
        plate_logs: {
          type: "array",
          example: [plate_log_object]
        },
        login: {
          type: "object",
          example: {
            username: "my-username",
            password: "123456",
          }
        }
      }
    }
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: [`./routes/*.js`],
}


exports.specs = swaggerJsdoc(options);
