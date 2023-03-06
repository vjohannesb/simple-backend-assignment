export default {
  'get-brand': {
    handler: 'src/functions/getBrand/index.handler',
    events: [
      {
        httpApi: {
          path: '/brands/{brand}',
          method: 'get',
        },
      },
    ],
  },
  'get-brands': {
    handler: 'src/functions/getBrands/index.handler',
    events: [
      {
        httpApi: {
          path: '/brands',
          method: 'get',
        },
      },
    ],
  },
};
