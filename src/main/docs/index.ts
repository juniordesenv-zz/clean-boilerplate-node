import paths from './paths';
import components from './components';
import schemas from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: '4Dev - Enquetes para Programadores',
    description: 'API de ente',
    version: '1.0.0',
  },
  servers: [{
    url: '/api',
    description: 'Servidor Principal',
  }],
  tags: [{
    name: 'Login',
    description: 'APIs relacionadas a Login',
  }, {
    name: 'Enquete',
    description: 'APIs relacionadas a Enquete',
  }],
  paths,
  schemas,
  components,
};
