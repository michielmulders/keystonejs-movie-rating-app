const { Keystone } = require('@keystonejs/keystone');
const { Text, Integer } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { StaticApp } = require('@keystonejs/app-static');

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const PROJECT_NAME = 'Movie Rating';

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
});

// Define schema for movie ratings
keystone.createList('Movie', {
  fields: {
    title: { 
      type: Text,
      isRequired: true,
      isUnique: true
    },
    rating: { 
      type: Integer,
      isRequired: true,
      defaultValue: 10
    }
  },
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(), 
    new StaticApp({ path: '/', src: 'public' }),
    new AdminUIApp({ enableDefaultRoute: true })
  ],
};
