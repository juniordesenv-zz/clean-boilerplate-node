import paths from './paths';
import components from './components';
import schemas from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Boilerplate - CleanArch/DDD',
    description: 'API Boilerplate',
    version: '1.0.0',
  },
  servers: [{
    url: '/api',
    description: 'Servidor Principal',
  }],
  tags: [
    {
      name: 'Autenticação',
      description: 'APIs relacionadas a Autenticação',
    },
    {
      name: 'Perfil',
      description: 'APIs relacionadas ao perfil',
    },
  ],
  paths,
  schemas,
  components,
};
